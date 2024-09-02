import { BusinessException } from './business-exception';

export class PrismaException extends BusinessException {
  constructor(message: string) {
    super(message);
    this.name = 'PrismaException';
  }
}
