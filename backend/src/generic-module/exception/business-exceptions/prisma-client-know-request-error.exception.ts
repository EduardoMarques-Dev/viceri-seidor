import { HttpExceptionOptions } from '@nestjs/common';
import { BusinessException } from './business-exception';

export class PrismaClientKnownRequestErrorException extends BusinessException {
  constructor(descriptionOrOptions?: string | HttpExceptionOptions) {
    super(
      `Error in Prisma Client - ${descriptionOrOptions}`,
      descriptionOrOptions,
    );
  }
}
