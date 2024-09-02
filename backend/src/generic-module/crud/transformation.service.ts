import { instanceToPlain, plainToClass } from 'class-transformer';
import { ViceriCryptoTransformService } from './decorators/transform/viceri-crypto-transform.decorator';
import { GenericDto } from './model/dto/generic.dto';
import { GenericModel } from './model/generic.model';

export class TransformationService<TModel extends GenericModel> {
  private readonly contextModel: TModel;
  private viceriCryptoOperations: ViceriCryptoTransformService;

  /**
   * Creates an instance of PrismaParamService.
   *
   * @param {new (...args: any[]) => TModel} modelConstructor - The constructor function for the generic model used for CRUD operations.
   */
  constructor(
    private readonly modelConstructor: new (...args: any[]) => TModel,
  ) {
    this.contextModel = new this.modelConstructor();

    this.viceriCryptoOperations = new ViceriCryptoTransformService();
  }

  public async encrypt(params: any) {
    await this.viceriCryptoOperations.encrypt(this.contextModel, params);
  }

  public async decrypt(entity: TModel) {
    await this.viceriCryptoOperations.decrypt(this.contextModel, entity);
  }

  public async ignoreEncrypted(entity: TModel) {
    await this.viceriCryptoOperations.ignoreEncrypted(
      this.contextModel,
      entity,
    );
  }

  /**
   * Converts the object to the specified return type.
   *
   * @private
   * @param {U} returnType - The return type to convert the object to.
   * @param {any} model - The object to be converted.
   * @returns {U} The converted object.
   */
  public convertToType<U extends GenericDto | GenericModel>(
    returnType: new (...args: any[]) => U,
    model: any,
  ): U {
    model = instanceToPlain(model) as typeof returnType;
    const convertedObject: U = plainToClass(returnType, model);
    return convertedObject;
  }
}
