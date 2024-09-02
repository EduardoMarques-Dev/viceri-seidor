import { ViceriCreateParamService } from './decorators/param/viceri-create-param.decorator';
import { ViceriIncludeParamService } from './decorators/param/viceri-include-param.decorator';

import { ActionType } from './enum/endpoint.enum';
import { GenericModel } from './model/generic.model';

export class ParamService<TModel extends GenericModel> {
  private readonly contextModel: TModel;
  private viceriCreateParamService: ViceriCreateParamService<TModel>;
  private viceriIncludeParamService: ViceriIncludeParamService<TModel>;

  /**
   * Creates an instance of PrismaParamService.
   *
   * @param {new (...args: any[]) => TModel} modelConstructor - The constructor function for the generic model used for CRUD operations.
   */
  constructor(
    private readonly modelConstructor: new (...args: any[]) => TModel,
  ) {
    this.contextModel = new this.modelConstructor();
    this.viceriIncludeParamService = new ViceriIncludeParamService(
      modelConstructor,
    );
    this.viceriCreateParamService = new ViceriCreateParamService(
      modelConstructor,
    );
  }

  /**
   * Retrieves the data object for Prisma create operations based on the __createProperties of the model.
   * The __createProperties should be an array containing the names of properties to create.
   *
   * @private
   * @param {any} model - The object containing the data to be created.
   * @returns {Record<string, boolean> | undefined} The data object for Prisma create operations, or undefined if __createProperties is not defined.
   */
  public getParamData(model: Partial<TModel>): Partial<TModel> | undefined {
    return this.viceriCreateParamService.getSubResourceCreateParam(model);
  }

  /**
   * Constructs a 'where' object for Prisma queries based on the customer_id and optional id.
   * This function is used to filter query results by customer and/or unique identifier.
   *
   * @private
   * @param {string} customer_id - The customer identifier.
   * @param {string} id - The unique identifier for the object (optional).
   * @returns {any} The 'where' object for Prisma queries.
   */
  public getParamWhere(id?: string): any {
    const where: any = {};

    if (id) {
      where.id = id;
    }

    return where;
  }

  /**
   * Gets the include object for Prisma queries based on the __includeProperties of the model.
   * The __includeProperties should be an array containing the names of properties to include in the query.
   *
   * @private
   * @param {ActionType[]} actionTypes - An array of action types for which the include object should be generated.
   * @returns {Record<string, boolean> | undefined} The include object for Prisma queries, or undefined if __includeProperties is not defined.
   */
  public getParamInclude(
    actionTypes: ActionType[],
  ): Record<string, boolean> | undefined {
    let include: Record<string, boolean> | undefined = undefined;

    // Check if the "__includeProperties" property is defined
    include = this.viceriIncludeParamService.getSubResourceIncludeParam(
      actionTypes,
      include,
    );

    return include;
  }
}
