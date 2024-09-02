import { PrismaService } from '../../database/prisma/prisma.service';
import { ForeignKeyException } from '../exception/business-exceptions/foreign-key.exception';
import { ViceriKeyValidationservice } from './decorators/validation/viceri-key-validation.decorator';
import { GenericModel } from './model/generic.model';

export class GenericValidationService<TModel extends GenericModel> {
  private viceriKeyValidationService: ViceriKeyValidationservice<TModel>;

  /**
   * Creates an instance of PrismaParamService.
   *
   * @param {new (...args: any[]) => TModel} modelConstructor - The constructor function for the generic model used for CRUD operations.
   */
  constructor(
    private readonly prismaViceriValidationService: PrismaService,
    private readonly modelConstructor: new (...args: any[]) => TModel,
  ) {
    this.viceriKeyValidationService = new ViceriKeyValidationservice(
      prismaViceriValidationService,
      modelConstructor,
    );
  }

  /**
   * Checks if foreign keys in the input model are not referencing data from another customer.
   *
   * @param {string} customer_id - The ID of the customer associated with the current user.
   * @param {GenericModel} inputModel - The input model containing data to check for foreign key references.
   * @throws {ForeignKeyException} Throws a ForeignKeyException if the foreign keys reference data from a different customer or if the customer does not exist.
   * @returns {Promise<void>} - Resolves if the foreign keys are valid; otherwise, throws an exception.
   */
  public async checkModelForeignKey(inputModel: GenericModel): Promise<void> {
    // Validate foreign keys in the input model against the customer_id
    await this.viceriKeyValidationService.validateForeignKeys(inputModel);
  }
}
