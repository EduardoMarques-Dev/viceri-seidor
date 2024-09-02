import {
  HttpExceptionOptions,
  InternalServerErrorException,
} from '@nestjs/common';

export class BusinessException extends InternalServerErrorException {
  constructor(
    objectOrError?: string | object | any,
    descriptionOrOptions?: string | HttpExceptionOptions,
  ) {
    super(objectOrError, descriptionOrOptions);
  }
}
