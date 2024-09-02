import { EncryptionReturnType } from '../../crud/decorators/transform/viceri-crypto-transform.decorator';

export class ControllerOptions<U> {
  returnType?: new (...args: any[]) => U;
  encryptionReturnType?: EncryptionReturnType;
  take?: number;
  skip?: number;
}

export class ControllerOptionsBuilder<U> {
  private controllerOptions: ControllerOptions<U>;

  private constructor(private returnType: new (...args: any[]) => U) {
    this.controllerOptions = new ControllerOptions<U>();
    this.controllerOptions.returnType = returnType;
  }

  static returnType<T>(
    returnType: new (...args: any[]) => T,
  ): ControllerOptionsBuilder<T> {
    return new ControllerOptionsBuilder<T>(returnType);
  }

  encryptionReturnType(
    encryptionReturnType: EncryptionReturnType,
  ): ControllerOptionsBuilder<U> {
    this.controllerOptions.encryptionReturnType = encryptionReturnType;
    return this;
  }

  take(take: number): ControllerOptionsBuilder<U> {
    this.controllerOptions.take = take;
    return this;
  }

  skip(skip: number): ControllerOptionsBuilder<U> {
    this.controllerOptions.skip = skip;
    return this;
  }

  page(page: number): ControllerOptionsBuilder<U> {
    if (
      this.controllerOptions.take &&
      page > 0 &&
      (this.controllerOptions.skip === undefined ||
        isNaN(this.controllerOptions.skip))
    ) {
      this.controllerOptions.skip = this.controllerOptions.take * (page - 1);
    }
    return this;
  }

  build(): ControllerOptions<U> {
    return this.controllerOptions;
  }
}
