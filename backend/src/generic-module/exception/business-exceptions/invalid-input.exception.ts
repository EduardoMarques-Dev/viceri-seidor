import { BusinessException } from './business-exception';

export class InvalidInputException extends BusinessException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidInputException';
  }
}
