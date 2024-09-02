import {
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ControllerOptions } from '../common/builder/controller-options.builder';
import { Optional } from '../common/helper/vic-optional';
import {
  CreateArgs,
  FindAllArgs,
  FindFirstArgs,
  UpdateArgs,
} from '../common/interfaces/vic-prisma.interface';
import { BusinessException } from '../exception/business-exceptions/business-exception';
import { handlePrismaClientError } from '../exception/business-exceptions/handle-prisma-client-error.function';
import { GenericService, ServiceOptions } from './generic.service';
import { CreateManyObjects } from './model/dto/create-many-objects.dto';
import { GenericDto } from './model/dto/generic.dto';
import { GenericModel } from './model/generic.model';

/**
 * Generic Controller implementing common CRUD methods.
 * The methods require the target service to implement specific logic
 * for operations such as find, create, update, and delete.
 *
 * @template TModel - The type of data the controller operates on.
 */
export class GenericController<TModel extends GenericModel> {
  protected readonly model: TModel;

  /**
   * Creates an instance of GenericController.
   *
   * @param {GenericService<TModel>} genericService - The generic service for handling CRUD operations.
   */
  constructor(private readonly genericService: GenericService<TModel>) {
    this.model = new (this.getModelConstructor())();
  }

  /**
   * Retrieves a list of objects of type T based on the provided parameters.
   *
   * @async
   * @param {ControllerOptions<U>} [options] - Optional. Additional options for customizing the query.
   * @returns {Promise<TModel[] | U[]>} A Promise that resolves to an array of objects of type T or U.
   */
  protected async genericFindMany<U extends GenericDto>(
    options?: ControllerOptions<U>,
  ): Promise<TModel[] | U[]> {
    try {
      /**
       * Constructs the query parameters for retrieving objects.
       */
      const params: FindAllArgs =
        this.genericService.PrepareFindAllArgs(options);

      /**
       * Retrieves objects from the database.
       */
      const result: TModel[] = await this.genericService.genericFindMany(
        params,
        this.getServiceOptions(options),
      );

      /**
       * Optionally, converts the result to the specified return type.
       */
      return options && options.returnType
        ? result.map((item) =>
            this.genericService.convertToType(options.returnType, item),
          )
        : result;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Retrieves a single object of type T based on the provided unique identifier.
   *
   * @async
   * @param {string} id - The unique identifier for the object.
   * @param {ControllerOptions<U>} [options] - Optional. Additional options for customizing the query.
   * @returns {Promise<TModel | U>} A Promise that resolves to an object of type T or null if not found.
   * @throws {HttpException} If the object with the specified ID is not found.
   */
  protected async genericFindFirst<U extends GenericDto>(
    id: string,
    options?: ControllerOptions<U>,
  ): Promise<TModel | U> {
    try {
      /**
       * Constructs the query parameters for retrieving a single object.
       */
      const params: FindFirstArgs =
        this.genericService.prepareFindFirstArgs(id);

      /**
       * Retrieves the object from the database.
       */
      const resultOptional: Optional<TModel> =
        await this.genericService.genericFindFirst(
          params,
          this.getServiceOptions(options),
        );

      /**
       * Handles the case when the object is not found.
       */
      if (!resultOptional.isPresent()) {
        throw new NotFoundException(
          `Object ${this.model.__entityName.toUpperCase()} with ID ${id} was not found`,
        );
      }

      /**
       * Optionally, converts the result to the specified return type.
       */
      return options && options.returnType
        ? this.convertToType(options.returnType, resultOptional.get())
        : resultOptional.get();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Creates a new object of type T.
   *
   * @async
   * @param {any} model - The object containing the data to be created.
   * @param {ControllerOptions<U>} [options] - Optional. Additional options for customizing the create operation.
   * @returns {Promise<TModel | U>} A Promise that resolves to the created object of type T, or U if the return type is specified.
   */
  protected async genericCreate<U extends GenericDto>(
    model: GenericModel | GenericDto,
    options?: ControllerOptions<U>,
  ): Promise<TModel | U> {
    try {
      const modelValidated: TModel =
        this.genericService.convertModelToDomain(model);

      const params: CreateArgs = await this.genericService.PrepareCreateArgs(
        modelValidated,
      );

      /**
       * Performs the create operation.
       */
      const result: TModel = await this.genericService.genericCreate(params);

      /**
       * Optionally, converts the result to the specified return type.
       */
      return options && options.returnType
        ? this.convertToType(options.returnType, result)
        : result;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Creates multiple objects of type T.
   *
   * @async
   * @param {any[]} models - An array of objects containing the data to be created.
   * @param {ControllerOptions<U>} [options] - Optional. Additional options for customizing the create operation.
   * @param {Response} res - The HTTP response object for setting the status code.
   * @returns {Promise<CreateManyObjects<TModel>>} A Promise that resolves to an object containing created objects of type T, and any failures.
   */
  public async genericCreateMany<U extends GenericDto>(
    models: any[],
    @Res({ passthrough: true }) res: Response,
    options?: ControllerOptions<U>,
  ): Promise<CreateManyObjects<TModel>> {
    try {
      const modelsValidated: TModel[] =
        this.genericService.convertModelsToDomain(models);

      /**
       * Prepare the create args for each model, with validation, foreign key check, etc...
       */
      const createArgsList: CreateArgs[] = await Promise.all(
        modelsValidated.map(async (model) => {
          const params: CreateArgs =
            await this.genericService.PrepareCreateArgs(model);
          return params;
        }),
      );

      /**
       * Performs the create-many operation.
       */
      const createdObjects: CreateManyObjects<TModel> =
        await this.genericService.genericCreateMany(createArgsList);

      /**
       * Optionally, converts the results to the specified return type.
       */
      if (options && options.returnType) {
        createdObjects.successes.map((result) =>
          this.convertToType(options.returnType, result),
        );
      }

      /**
       * Sets the HTTP response status code based on success or failure.
       */
      if (createdObjects.successes.length > 0) {
        if (createdObjects.failures.length > 0) {
          res.status(206);
        }
      } else {
        if (createdObjects.failures.length > 0) {
          res.status(500);
        } else {
          res.status(200);
        }
      }

      return createdObjects;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Updates an existing object of type T.
   *
   * @async
   * @param {string} id - The unique identifier for the object to be updated.
   * @param {Partial<TModel>} model - The partial object containing the data to be updated.
   * @param {ControllerOptions<U>} [options] - Optional. Additional options for customizing the update operation.
   * @returns {Promise<TModel | U>} A Promise that resolves to the updated object of type T, or U if the return type is specified.
   * @throws {NotFoundException} If the object with the specified ID is not found.
   */
  protected async genericUpdate<U extends GenericDto>(
    id: string,
    model: GenericDto,
    options?: ControllerOptions<U>,
  ): Promise<TModel | U> {
    try {
      const modelValidated: TModel =
        this.genericService.convertModelToDomain(model);

      const params: UpdateArgs = await this.genericService.PrepareUpdateArgs(
        modelValidated,
        id,
      );

      /**
       * Performs the update operation.
       */
      const result: Optional<TModel> = await this.genericService.genericUpdate(
        params,
      );

      if (!result.isPresent()) {
        throw new NotFoundException(
          `Object ${this.model.__entityName.toUpperCase()} with ID ${id} was not found`,
        );
      }

      /**
       * Optionally, converts the result to the specified return type.
       */
      return options && options.returnType
        ? this.convertToType(options.returnType, result.get())
        : result.get();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Deletes an existing object of type T.
   *
   * @async
   * @param {string} id - The unique identifier for the object to be deleted.
   * @returns {Promise<void>} A Promise that resolves when the object of type T is deleted.
   */
  protected async genericDelete(id: string): Promise<void> {
    try {
      return await this.genericService.genericDelete({ where: { id } });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Retrieves the model associated with this service.
   *
   * @returns {GenericModel} The model associated with this service.
   */
  getModel(): GenericModel {
    return this.model;
  }

  /**
   * Retrieves the constructor function of the model associated with this service.
   *
   * @returns {new () => TModel} The constructor function of the model.
   */
  getModelConstructor(): new () => TModel {
    return this.genericService.getModelConstructor();
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
    return this.genericService.convertToType(returnType, model);
  }

  /**
   * Retrieves service options based on the provided controller options.
   *
   * @private
   * @param {ControllerOptions<U>} options - The controller options for customizing the service operation.
   * @returns {ServiceOptions} The service options to be used in the operation.
   */
  private getServiceOptions<U>(options: ControllerOptions<U>): ServiceOptions {
    return {
      encryptionReturnType: options?.encryptionReturnType,
    };
  }

  /**
   * Handles errors that occur during service operations.
   *
   * @param {any} error - The error object thrown during the service operation.
   * @throws {BusinessException | NotFoundException | ForbiddenException | HttpException | InternalServerErrorException} The appropriate exception based on the error type.
   */
  public handleError(error: any) {
    if (error instanceof BusinessException) {
      throw error;
    } else if (error.name === 'PrismaClientKnownRequestError') {
      handlePrismaClientError(error);
    } else if (error instanceof NotFoundException) {
      throw new NotFoundException(error.message);
    } else if (error instanceof HttpException) {
      throw new HttpException(error.message, error.getStatus());
    } else if (error instanceof ForbiddenException) {
      throw new ForbiddenException(error.message);
    } else if (error instanceof NotFoundException) {
      throw new NotFoundException(error.message);
    } else {
      throw new InternalServerErrorException(error.message);
    }
  }
}
