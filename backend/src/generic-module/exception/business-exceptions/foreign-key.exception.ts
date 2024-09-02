import { HttpExceptionOptions } from '@nestjs/common';
import { BusinessException } from './business-exception';

export class ForeignKeyException extends BusinessException {
  constructor(
    className: string,
    id: string,
    descriptionOrOptions?: string | HttpExceptionOptions,
  ) {
    super(
      `Object ${className.toUpperCase()} with ID ${id} was not found`,
      descriptionOrOptions,
    );
  }
}
