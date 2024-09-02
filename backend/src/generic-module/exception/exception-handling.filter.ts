import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import { BusinessException } from './business-exceptions/business-exception';
import {
  CustomHttpExceptionResponse,
  HttpExceptionResponse,
} from './interfaces/http-exception-response.interface';

@Catch()
export class ExceptionHandlingFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status: HttpStatus;
    let errorMessage: any;

    if (exception instanceof BusinessException) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = `Business rule exception: ${exception.message}`;
    } else if (exception instanceof BadRequestException) {
      status = HttpStatus.BAD_REQUEST;
      errorMessage = this.getBadRequestErrorMessage(exception);
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      errorMessage =
        (errorResponse as HttpExceptionResponse).error || exception.message;
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = `Critical internal server error ocurred: ${exception.message}`;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = 'Critical internal server error ocurred!';
    }

    const errorResponse: CustomHttpExceptionResponse = this.getErrorResponse(
      status,
      errorMessage,
      request,
    );
    const errorLog = this.getErrorLog(errorResponse, request, exception);
    this.writeErrorLogToFile(errorLog);

    response.status(status).json(errorResponse);
  }

  private getErrorResponse = (
    status: HttpStatus,
    errorMessage: string,
    request: Request,
  ): CustomHttpExceptionResponse => ({
    statusCode: status,
    error: errorMessage,
    path: request.url,
    method: request.method,
    timeStamp: new Date(),
  });

  private getErrorLog = (
    errorResponse: CustomHttpExceptionResponse,
    request: Request,
    exception: unknown,
  ): string => {
    const { statusCode, timeStamp } = errorResponse;
    const { method, url } = request;

    const logParts = [];

    logParts.push(
      '===========================================================================================================',
    );
    logParts.push(
      `Response Code: ${statusCode} | Method: ${method} | URL: ${url} | Timestamp: ${timeStamp}`,
    );
    logParts.push('');
    logParts.push('--- ERROR RESPONSE');
    logParts.push(JSON.stringify(errorResponse));
    logParts.push('');
    logParts.push('--- ERROR MESSAGE');
    logParts.push(exception instanceof Error ? exception.message : 'Error');
    logParts.push('');
    logParts.push('--- ERROR STACK');
    logParts.push(exception instanceof Error ? exception.stack : 'Error');
    logParts.push('');
    logParts.push('');

    const errorLog = logParts.join('\n');

    console.log(errorLog);

    return errorLog;
  };

  private writeErrorLogToFile = (errorLog: string): void => {
    fs.appendFile('error.log', errorLog, 'utf8', (err) => {
      if (err) throw err;
    });
  };

  private getBadRequestErrorMessage = (
    exception: BadRequestException,
  ): string | object => {
    const { message } = exception.getResponse() as { message: string | object };
    if (typeof message === 'string' || typeof message === 'object') {
      return message;
    }
    return 'Bad Request';
  };
}
