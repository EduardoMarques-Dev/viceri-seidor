import { BusinessException } from './business-exception';

export class PrimaryKeyNotFoundException extends BusinessException {
  constructor(message: string) {
    super(message);
    this.name = 'PrimaryKeyNotFoundException';
  }
}
