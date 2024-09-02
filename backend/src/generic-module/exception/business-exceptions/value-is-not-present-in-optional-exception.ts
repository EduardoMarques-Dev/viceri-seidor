import { HttpExceptionOptions } from '@nestjs/common';
import { BusinessException } from './business-exception';

export class ValueIsNotPresentInOptional extends BusinessException {
  constructor(
    objectType?: string,
    objectId?: string,
    descriptionOrOptions?: string | HttpExceptionOptions,
  ) {
    let message = 'Value is not present in Optional.';

    if (objectType) {
      message = `Object ${
        objectType + objectId ? ` with id ${objectId},` : ''
      } is not present in Optional.`;
    }

    super(message, descriptionOrOptions);
  }
}
