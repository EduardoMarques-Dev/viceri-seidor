import { InternalServerErrorException } from '@nestjs/common';
import { RoleType } from '@prisma/client';
import { PrismaService } from '../../database/prisma/prisma.service';
import { UserModel } from '../../system-module/user/model/user.model';
import { ControllerOptions } from '../common/builder/controller-options.builder';
import { Optional } from '../common/helper/vic-optional';
import {
  CreateArgs,
  CreateArgsBuilder,
  DeleteArgs,
  FindAllArgs,
  FindAllArgsBuilder,
  FindFirstArgs,
  FindFirstArgsBuilder,
  UpdateArgs,
  UpdateArgsBuilder,
} from '../common/interfaces/vic-prisma.interface';
import { LoggerService } from '../logger/logger.service';
import { ViceriDeleteProcessService } from './decorators/process/viceri-delete-process.decorator';
import { EncryptionReturnType } from './decorators/transform/viceri-crypto-transform.decorator';
import { ActionType } from './enum/endpoint.enum';
import { GenericValidationService } from './generic-validation.service';
import { CreateManyObjects } from './model/dto/create-many-objects.dto';
import { GenericDto } from './model/dto/generic.dto';
import { GenericModel } from './model/generic.model';
import { ParamService } from './param.service';
import { TransformationService } from './transformation.service';

export class ServiceOptions {
  encryptionReturnType?: EncryptionReturnType;
}

/**
 * Abstract base service that provides generic CRUD functionality.
 * Other services can extend this class to inherit methods for creating, finding, updating, and deleting data.
 *
 * @template TModel - The type of data the service operates on.
 * @template TFindAll - The type for the findMany operation arguments.
 * @template TFindFirst - The type for the findFirst operation arguments.
 * @template TCreate - The type for the create operation arguments.
 * @template TUpdate - The type for the update operation arguments.
 * @template TDelete - The type for the delete operation arguments.
 */
export abstract class GenericService<
  TModel extends GenericModel,
  TFindAll extends FindAllArgs = FindAllArgs,
  TFindFirst extends FindFirstArgs = FindFirstArgs,
  TCreate extends CreateArgs = CreateArgs,
  TUpdate extends UpdateArgs = UpdateArgs,
  TDelete extends DeleteArgs = DeleteArgs,
> {
  protected readonly contextModel: TModel;
  public readonly prismaSchema: string;

  protected paramService: ParamService<TModel>;
  protected genericValidationService: GenericValidationService<TModel>;
  protected viceriDeleteProcessService: ViceriDeleteProcessService<TModel>;
  protected transformationService: TransformationService<TModel>;

  /**
   * Creates an instance of GenericService.
   *
   * @param {new (...args: any[]) => TModel} modelConstructor - The constructor function for the generic model used for CRUD operations.
   * @param {PrismaService} prismaService - The Prisma service instance used for database interactions.
   * @param {LoggerService} loggerService - The Logger service instance used for logging operations.
   */
  constructor(
    protected readonly modelConstructor: new (...args: any[]) => TModel,
    protected readonly prismaService: PrismaService,
    protected readonly loggerService: LoggerService,
  ) {
    this.contextModel = new this.modelConstructor();
    this.prismaSchema = this.contextModel.__prismaSchemaName;
    this.paramService = new ParamService(modelConstructor);
    this.genericValidationService = new GenericValidationService(
      prismaService,
      modelConstructor,
    );
    this.transformationService = new TransformationService(modelConstructor);
    this.viceriDeleteProcessService = new ViceriDeleteProcessService(
      prismaService,
      modelConstructor,
    );
  }

  /**
   * Retrieves a list of generic objects based on the provided parameters.
   *
   * @async
   * @param {TFindAll} params - An object containing the search parameters.
   * @param {ServiceOptions} [options] - Additional options for the service operation.
   * @returns {Promise<TModel[]>} A Promise that resolves to an array of generic objects.
   */
  async genericFindMany(
    params?: TFindAll,
    options?: ServiceOptions,
  ): Promise<TModel[]> {
    const result = await this.prismaService[this.prismaSchema].findMany(params);
    await this.afterFindMany(result, options);
    return result;
  }

  /**
   * Retrieves a single generic object based on the provided unique identifier.
   *
   * @async
   * @param {TFindFirst} params - An object containing the search parameters.
   * @param {ServiceOptions} [options] - Additional options for the service operation.
   * @returns {Promise<Optional<TModel>>} A Promise that resolves to a generic object or null if not found.
   */
  async genericFindFirst(
    params: TFindFirst | FindFirstArgs,
    options?: ServiceOptions,
  ): Promise<Optional<TModel>> {
    try {
      const result = await this.prismaService[this.prismaSchema].findFirst(
        params,
      );
      await this.afterFindFirst(result, options);
      return Optional.of(result);
    } catch (err) {
      this.loggerService.log(`Exception Message: ${err.message}`);
      this.loggerService.log(`Param Exception: ${params}`);
      return Optional.EMPTY();
    }
  }

  /**
   * Creates a new generic object.
   *
   * @async
   * @param {TCreate} params - The generic Prisma object containing the data to be created.
   * @returns {Promise<TModel>} A Promise that resolves to the created generic object.
   */
  async genericCreate(params: TCreate): Promise<TModel> {
    this.loggerService.silly(`Persisted: ${this.prismaSchema}`);
    await this.beforeCreate(params);
    const result: TModel = await this.prismaService[this.prismaSchema].create(
      params,
    );
    return result;
  }

  /**
   * Creates multiple generic objects.
   *
   * @async
   * @param {TCreate[]} paramsList - A list of generic Prisma objects containing the data to be created.
   * @returns {Promise<CreateManyObjects<TModel>>} A Promise that resolves to an object containing the created generic objects and any failures.
   */
  async genericCreateMany(
    paramsList: TCreate[],
  ): Promise<CreateManyObjects<TModel>> {
    const successes: TModel[] = [];
    const failures: Error[] = [];

    try {
      for (const params of paramsList) {
        try {
          await this.beforeCreate(params);
          const result: TModel = await this.prismaService[
            this.prismaSchema
          ].create(params);

          successes.push(result);
        } catch (encryptError) {
          failures.push(encryptError);
        }
      }

      return { successes, failures };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  /**
   * Updates an existing generic object.
   *
   * @async
   * @param {TUpdate} params - An object specifying the unique identifier and the data to be updated.
   * @returns {Promise<Optional<TModel>>} A Promise that resolves to the updated generic object.
   */
  async genericUpdate(params: TUpdate): Promise<Optional<TModel>> {
    this.loggerService.silly(`Updated: ${this.prismaSchema}`);
    try {
      await this.beforeUpdate(params);
      const result = await this.prismaService[this.prismaSchema].update(params);
      return Optional.of(result);
    } catch (err) {
      this.loggerService.log(`Exception Message: ${err.message}`);
      this.loggerService.log(`Param Exception: ${params}`);
      return Optional.EMPTY();
    }
  }

  /**
   * Deletes an existing generic object.
   *
   * @async
   * @param {TDelete} params - An object specifying the unique identifier for the record to be deleted.
   * @returns {Promise<void>} A Promise that resolves when the record and its child records are deleted.
   */
  async genericDelete(params: TDelete): Promise<void> {
    return await this.viceriDeleteProcessService.DeleteCascadeProcess(
      params.where.id,
    );
  }

  /**
   * Retrieves the model associated with this service.
   *
   * @returns {TModel} The model associated with this service.
   */
  getModel(): TModel {
    return this.contextModel;
  }

  /**
   * Get the constructor of the generic model class.
   *
   * @returns {new () => TModel} The constructor of the generic model class.
   */
  public getModelConstructor(): new () => TModel {
    return this.modelConstructor;
  }

  /**
   * Prepares the arguments for a findAll operation based on the provided options.
   *
   * @param {ControllerOptions<any>} [options] - The options for the findAll operation.
   * @returns {FindAllArgs} The prepared findAll arguments.
   */
  public PrepareFindAllArgs(options?: ControllerOptions<any>): FindAllArgs {
    return FindAllArgsBuilder.create()
      .where(this.getParamWhere())
      .include(this.getParamInclude([ActionType.READ, ActionType.LIST]))
      .take(options.take)
      .skip(options.skip)
      .build();
  }

  /**
   * Prepares the arguments for a findFirst operation based on the provided unique identifier.
   *
   * @param {string} id - The unique identifier for the object to find.
   * @returns {FindFirstArgs} The prepared findFirst arguments.
   */
  public prepareFindFirstArgs(id: string): FindFirstArgs {
    return FindFirstArgsBuilder.create(this.getParamWhere(id))
      .include(this.getParamInclude([ActionType.READ, ActionType.GET_ONE]))
      .build();
  }

  /**
   * Prepares the arguments for creating a new object, ensuring data integrity and validity.
   *
   * @async
   * @param {GenericModel | GenericDto} model - The model or DTO representing the object to be created.
   * @returns {Promise<TCreate>} A Promise that resolves with the prepared create parameters.
   */
  public async PrepareCreateArgs(
    model: GenericModel | GenericDto,
  ): Promise<TCreate> {
    // Converts the provided model to the appropriate type (T).
    const convertedModel: TModel = this.transformationService.convertToType(
      this.getModelConstructor(),
      model,
    );

    // Validates foreign keys in the model.
    await this.genericValidationService.checkModelForeignKey(convertedModel);

    // Constructs the create parameters.
    const builder = CreateArgsBuilder.create<TCreate>(
      this.getModelConstructor(),
    );

    const params: TCreate = builder
      .setData(this.getParamData(convertedModel))
      .setInclude(this.getParamInclude([ActionType.CREATE]))
      .build();

    return params;
  }

  /**
   * Prepares the arguments for updating an existing object, ensuring data integrity and validity.
   *
   * @async
   * @param {TModel} model - The model representing the object with updated data.
   * @param {string} id - The unique identifier of the object to be updated.
   * @returns {Promise<TUpdate>} A Promise that resolves with the prepared update parameters.
   */
  public async PrepareUpdateArgs(
    model: TModel,
    id: string,
  ): Promise<UpdateArgs> {
    const convertedModel: TModel = this.transformationService.convertToType(
      this.getModelConstructor(),
      model,
    );

    // Validates foreign keys in the model.
    await this.genericValidationService.checkModelForeignKey(convertedModel);

    // Constructs the update parameters.
    const params: UpdateArgs = UpdateArgsBuilder.create(
      this.getModelConstructor(),
      { id: id },
    )
      .setData(this.getParamData(convertedModel))
      .setInclude(this.getParamInclude([ActionType.UPDATE]))
      .build();

    return params;
  }

  /**
   * Retrieves the data object for Prisma create operations based on the __createProperties of the model.
   * The __createProperties should be an array containing the names of properties to create.
   *
   * @param {any} model - The object containing the data to be created.
   * @returns {Partial<TModel>} The data object for Prisma create operations.
   */
  public getParamData(model: any): Partial<TModel> {
    return this.paramService.getParamData(model);
  }

  /**
   * Constructs a 'where' object for Prisma queries based on the customer_id and optional id.
   * This function is used to filter query results by customer and/or unique identifier.
   *
   * @param {string} [id] - The unique identifier for the object (optional).
   * @returns {any} The 'where' object for Prisma queries.
   */
  public getParamWhere(id?: string): any {
    return this.paramService.getParamWhere(id);
  }

  /**
   * Constructs an 'include' object for Prisma queries based on the provided action types.
   *
   * @param {ActionType[]} actionTypes - An array of action types for which the include object should be generated.
   * @returns {Record<string, boolean> | undefined} The 'include' object for Prisma queries.
   */
  public getParamInclude(
    actionTypes: ActionType[],
  ): Record<string, boolean> | undefined {
    return this.paramService.getParamInclude(actionTypes);
  }

  /**
   * Determines if the current user has an admin role.
   *
   * @param {UserModel} user - The user model to check.
   * @returns {boolean} True if the user has an admin role, false otherwise.
   */
  public userIsAdmin(user: UserModel): boolean {
    return user.roles?.includes(RoleType.ADMIN);
  }

  /**
   * Converts a given value to a string.
   *
   * This method accepts a value of any type and converts it into a string.
   * - If the value is already of type 'string', it is returned directly.
   * - If the value is not of type 'string' but is neither null nor undefined, it is converted to a string using JSON.stringify.
   * - If the value is null or undefined, an empty string is returned.
   *
   * @param {any} value - The value to be converted to a string.
   * @returns {string} The converted string or an empty string if the input is null or undefined.
   */
  public getString(value: any): string {
    return value
      ? typeof value === 'string'
        ? value
        : JSON.stringify(value)
      : '';
  }

  private async afterFindMany(entity: TModel, options: ServiceOptions) {
    await this.afterFind(entity, options);
  }

  private async afterFindFirst(entity: TModel, options: ServiceOptions) {
    await this.afterFind(entity, options);
  }

  private async afterFind(entity: TModel, options: ServiceOptions) {
    if (options && options.encryptionReturnType) {
      switch (options.encryptionReturnType) {
        case EncryptionReturnType.Ignore: {
          this.transformationService.ignoreEncrypted(entity);
          break;
        }
        case EncryptionReturnType.Decrypt: {
          this.transformationService.decrypt(entity);
          break;
        }
      }
    }
  }

  private async beforeCreate(params: TCreate) {
    await this.beforePersist(params);
  }

  private async beforeUpdate(params: TUpdate) {
    await this.beforePersist(params);
  }

  private async beforePersist(params: TCreate | TUpdate) {
    await this.transformationService.encrypt(params);
  }

  /**
   * Converts the object to the specified return type.
   *
   * @param {new (...args: any[]) => U} returnType - The return type to convert the object to.
   * @param {any} model - The object to be converted.
   * @returns {U} The converted object.
   */
  public convertToType<U extends GenericDto | GenericModel>(
    returnType: new (...args: any[]) => U,
    model: any,
  ): U {
    return this.transformationService.convertToType(returnType, model);
  }

  /**
   * Converts a model to its domain representation.
   *
   * @param {GenericDto | GenericModel} model - The model to be converted.
   * @returns {TModel} The converted model in its domain representation.
   */
  public convertModelToDomain(model: GenericDto | GenericModel): TModel {
    return this.transformationService.convertToType(
      this.getModelConstructor(),
      model,
    );
  }

  /**
   * Converts a list of models to their domain representation.
   *
   * @param {(GenericDto | GenericModel)[]} models - The list of models to be converted.
   * @returns {TModel[]} The list of converted models in their domain representation.
   */
  public convertModelsToDomain(
    models: (GenericDto | GenericModel)[],
  ): TModel[] {
    return models.map((model: any) => {
      return this.transformationService.convertToType(
        this.getModelConstructor(),
        model,
      );
    });
  }
}
