import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const className = context.getClass().name;
    const methodName = context.getHandler().name;

    const contextParts: string[] = [];
    contextParts.push(`${request.method} ${request.url}`);
    contextParts.push(`${className} - ${methodName}`);

    const contextMessage = contextParts.join(' | ');

    // Passa o contexto para o serviço de logger
    this.loggerService.setContext(contextMessage);

    return next.handle().pipe(
      tap(() => {
        // Limpa o contexto após a manipulação da solicitação
        this.loggerService.clearContext();
      }),
    );
  }
}
