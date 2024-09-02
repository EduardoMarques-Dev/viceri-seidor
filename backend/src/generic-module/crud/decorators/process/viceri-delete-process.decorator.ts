import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import {
  FindAllArgs,
  FindAllArgsBuilder,
} from '../../../common/interfaces/vic-prisma.interface';
import { GenericModel } from '../../model/generic.model';
import classRegistry from '../class-registry.handler';
import { ChildPropertyInterface } from '../interfaces/child-property.interface';

/**
 * A decorator used to mark child properties within a class, facilitating operations such as cascading deletes. This decorator enhances classes by allowing them to define and manage relationships with child models explicitly, making it simpler to perform nested operations like cascading deletions seamlessly.
 *
 * @param options The configuration options for the child properties.
 * @param options.modelName The name of the child model. This specifies which model is considered a child in the relationship.
 * @param options.relationField The field that establishes the relationship to the parent model. This field is used to link child instances back to their parent.
 * @returns A decorator function that is applied to class properties to register them as child properties with the specified configuration.
 */
export function Viceri_Delete_Process(
  options: ChildPropertyInterface,
): (target: any, key: string) => void {
  return (target: any, key: string) => {
    /**
     * Verifies if the class has a '__deleteProperties' property.
     * If not, it initializes the property as an empty array.
     */
    if (!target.hasOwnProperty('__deleteProperties')) {
      Object.defineProperty(target, '__deleteProperties', {
        value: [],
        configurable: false,
        enumerable: false,
        writable: false,
      });
    }

    // Constructs the child property configuration and adds it to the '__deleteProperties' array of the class. This configuration includes the property key, child model name, and the relation field.
    const childProperty: ChildPropertyInterface = {
      key: key,
      modelName: options.modelName,
      relationField: options.relationField,
    };
    target['__deleteProperties'].push(childProperty);
  };
}

/**
 * A service class designed to handle cascading delete operations for a given model. It leverages the child properties defined through the `Viceri_Delete_Process` decorator to recursively delete related child models, ensuring data integrity and consistency.
 *
 * @typeParam T - The type of the model this service will manage. It extends from a generic model base class, ensuring it has the necessary properties and methods for the operations.
 */
export class ViceriDeleteProcessService<T extends GenericModel> {
  private prisma: PrismaClient; // An instance of PrismaClient to interact with the database.
  private model: T; // An instance of the model T, which is the target of the cascade delete operations.

  /**
   * Constructs an instance of the ViceriDeleteProcessService with a Prisma service and a model constructor. This setup allows the service to perform database operations and manage instances of the model T.
   *
   * @param prismaService An instance of PrismaService, providing database access.
   * @param modelConstructor A constructor function for the model T, used to instantiate the model.
   */
  constructor(
    prismaService: PrismaService,
    private readonly modelConstructor: new (...args: any[]) => T,
  ) {
    this.model = new this.modelConstructor();
    this.prisma = prismaService;
  }

  /**
   * Initiates a cascading delete process starting from a specified root entity identified by its ID. It recursively deletes all related child entities as defined by the child properties in the model's class.
   *
   * @param id The ID of the root entity from which the cascading delete will start.
   */
  async DeleteCascadeProcess(id: string): Promise<void> {
    await this.recursiveDeleteCascadeProcess(this.model, id);
  }

  /**
   * A private method that performs the actual cascading delete operation. It recursively visits and deletes child entities based on the child properties defined in the model's class, ensuring all related entities are also deleted.
   *
   * @param model The current model instance being processed.
   * @param id The ID of the entity to delete.
   * @param n A counter used to track the recursion depth, primarily for logging purposes.
   */
  private async recursiveDeleteCascadeProcess(
    model: GenericModel,
    id: string,
    n = 0,
  ) {
    const tabulation = '|\t'; // Used for formatting log messages with indentation corresponding to recursion depth.
    // Logs the check operation before attempting to delete child entities.
    console.log(
      `${tabulation.repeat(n)}[CHECK]  ${model.__prismaSchemaName} : ${id}`,
    );

    // If the model has child properties defined, it proceeds to delete each child entity recursively.
    if (model.__deleteProperties) {
      for (const child of model.__deleteProperties) {
        // Instantiates the child model using its name.
        const instance: GenericModel = classRegistry.createInstance(
          child.modelName,
        );

        // Builds the query parameters to find child entities related to the current entity.
        const params: FindAllArgs = FindAllArgsBuilder.create()
          .where({
            [child.relationField]: id,
          })
          .build();

        // Fetches child entities using the built query parameters.
        const result = await this.prisma[instance.__prismaSchemaName].findMany(
          params,
        );

        // If child entities are found, it recursively deletes each one.
        if (result.length > 0) {
          for (const resultItem of result) {
            await this.recursiveDeleteCascadeProcess(
              instance,
              resultItem.id,
              n + 1,
            );
          }
        }
      }
    }

    // After handling all child entities, it proceeds to delete the current entity.
    console.log(
      `${tabulation.repeat(n)}[DELETE] ${model.__prismaSchemaName} : ${id}`,
    );
    await this.prisma[model.__prismaSchemaName].deleteMany({
      where: { id: id },
    });
  }
}
