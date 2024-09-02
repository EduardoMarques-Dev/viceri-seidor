import { PrismaClient } from '@prisma/client';
import { isPlainObject, isString } from 'lodash';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { UserModel } from '../../../../system-module/user/model/user.model';
import { FindFirstArgsBuilder } from '../../../common/interfaces/vic-prisma.interface';
import { ForeignKeyException } from '../../../exception/business-exceptions/foreign-key.exception';
import { GenericDto } from '../../model/dto/generic.dto';
import { GenericModel } from '../../model/generic.model';
import classRegistry from '../class-registry.handler';
import { ForeignKeyPropertyInterface } from '../interfaces/foreign-key-property.interface';

/**
 * Decorator responsible for validating if a foreign key belongs to the user,
 * preventing a foreign key from pointing to another user's data accidentally.
 *
 * @param {ForeignKeyPropertyInterface} options - An optional object containing foreign key details such as `modelName`.
 * @returns {Function} A decorator function to be used on class properties.
 */
export function Viceri_Key_Validation(
  options?: ForeignKeyPropertyInterface,
): (target: any, key: string) => void {
  return (target: any, key: string) => {
    /**
     * Verifies if the class has a '__foreignKeyProperties' property.
     * If not, it initializes the property as an empty array.
     */
    if (!target.hasOwnProperty('__foreignKeyProperties')) {
      Object.defineProperty(target, '__foreignKeyProperties', {
        value: [],
        configurable: false,
        enumerable: false,
        writable: false,
      });
    }

    /**
     * Stores the details of the property in the '__foreignKeyProperties' array.
     * This includes the property name and the associated model name.
     */
    const foreignKeyproperty: ForeignKeyPropertyInterface = {
      propertyName: key,
      modelName: options.modelName,
    };

    target['__foreignKeyProperties'].push(foreignKeyproperty);
  };
}

/**
 * Service responsible for validating foreign keys in a given model,
 * ensuring that they belong to the correct user and preventing
 * foreign keys from pointing to another user's data accidentally.
 *
 * @template T - The type of the model being validated.
 */
export class ViceriKeyValidationservice<T extends GenericModel> {
  private prisma: PrismaClient;
  private contextModel: T;

  /**
   * Creates an instance of ViceriKeyValidationservice.
   *
   * @param {PrismaService} prismaService - The Prisma service instance used for database operations.
   * @param {new (...args: any[]) => T} modelConstructor - The constructor of the model being validated.
   */
  constructor(
    prismaService: PrismaService,
    private readonly modelConstructor: new (...args: any[]) => T,
  ) {
    this.contextModel = new this.modelConstructor();
    this.prisma = prismaService;
  }

  /**
   * Validates the foreign keys in the input model to ensure they belong to the current user.
   *
   * @param {GenericModel | GenericDto} inputModel - The model or DTO containing the foreign keys to validate.
   * @param {UserModel} currentUser - The current user, used to validate ownership of the foreign keys.
   * @returns {Promise<void>}
   */
  async validateForeignKeys(
    inputModel: GenericModel | GenericDto,
  ): Promise<void> {
    if (this.contextModel.__foreignKeyProperties) {
      for (const foreignKeyProperty of this.contextModel
        .__foreignKeyProperties) {
        // Creates an instance of GenericModel based on foreignKeyProperty.modelName
        const classObject: GenericModel = classRegistry.createInstance(
          foreignKeyProperty.modelName,
        );

        // Finds the corresponding property name in the inputModel
        const foundPropertyName: string = Object.keys(inputModel).find(
          (propertyName) => propertyName === foreignKeyProperty.propertyName,
        );

        // If the property is found, determine whether it is a string (ID), an object, or an array of objects
        if (foundPropertyName) {
          if (isString(inputModel[foundPropertyName])) {
            // Validates if the foreign key (ID) exists in the database
            await this.checkIfIdExists(
              inputModel[foundPropertyName],
              classObject,
            );
          } else {
            const propertyValue = inputModel[foundPropertyName];
            let itemsToRecursiveValidate = [];

            if (isPlainObject(propertyValue)) {
              // If the property value is an object, prepare it for recursive validation
              itemsToRecursiveValidate = [propertyValue];
            } else if (Array.isArray(propertyValue) && propertyValue.length) {
              // If the property value is an array, validate each item recursively
              itemsToRecursiveValidate = propertyValue;
            }

            if (itemsToRecursiveValidate.length) {
              // Recursively validates the foreign keys of the related model(s)
              await this.recursiveValidateForeignKeys(
                itemsToRecursiveValidate,
                classObject,
              );
            }
          }
        }
      }
    }
  }

  /**
   * Recursively validates the foreign keys in the input models.
   * This method is used when a property contains nested objects or arrays of objects.
   *
   * @param {GenericModel[] | GenericDto[]} inputModels - An array of models or DTOs containing foreign keys to validate.
   * @param {GenericModel} classObject - The class object of the model being validated.
   * @returns {Promise<void>}
   */
  private async recursiveValidateForeignKeys(
    inputModels: GenericModel[] | GenericDto[],
    classObject: GenericModel,
  ): Promise<void> {
    for (const childInput of inputModels) {
      // Validates the foreign keys of the related model, if any
      // Uses the PrismaService injected in the current service
      const relatedService = new ViceriKeyValidationservice<T>(
        this.prisma as PrismaService,
        classObject.constructor as new (...args: any[]) => T,
      );
      await relatedService.validateForeignKeys(childInput);
    }
  }

  /**
   * Checks if the provided ID exists in the database for the specified model.
   * If the ID does not exist, a ForeignKeyException is thrown.
   *
   * @param {string} id - The ID of the foreign key to validate.
   * @param {GenericModel} classObject - The class object of the model being validated.
   * @returns {Promise<void>}
   * @throws {ForeignKeyException} If the foreign key does not exist in the database.
   */
  private async checkIfIdExists(
    id: string,
    classObject: GenericModel,
  ): Promise<void> {
    // Builds the query arguments to find the record with the given ID
    const args = FindFirstArgsBuilder.create({
      id,
    }).build();

    // Queries the database to find the record
    const result = await this.prisma[classObject.__prismaSchemaName].findFirst(
      args,
    );

    // If the result is null, it means the ID does not exist, so throw an exception
    if (result === null) {
      throw new ForeignKeyException(classObject.__entityName, id);
    }
  }
}
