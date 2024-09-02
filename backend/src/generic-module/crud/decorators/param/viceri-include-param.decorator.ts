import { ActionType } from '../../enum/endpoint.enum';
import { GenericModel } from '../../model/generic.model';
import { IncludePropertyInterface } from '../interfaces/include-property.interface';

/**
 * Decorator responsible for including/loading information from child classes in the parent class's return.
 *
 * @param {IncludePropertyInterface} options - Options for configuring the inclusion behavior.
 * @param {string} options.include - The property name to include.
 * @param {string[]} options.subIncludes - Sub-properties to include under the specified property.
 * @param {ActionType[]} options.endpoints - ActionType to include. Default is [ActionType.ALL].
 * @returns {Function} A decorator function to be used on class properties.
 */
export function Viceri_Include_Param(
  options?: IncludePropertyInterface,
): (target: any, key: string) => void {
  return (target: any, key: string) => {
    /**
     * Verifies if the class has a '__includeProperties' property.
     * If not, it initializes the property as an empty array.
     */
    if (!target.hasOwnProperty('__includeProperties')) {
      Object.defineProperty(target, '__includeProperties', {
        value: [],
        configurable: false,
        enumerable: false,
        writable: false,
      });
    }

    /**
     * Stores the inclusion configuration in the '__includeProperties' array.
     */
    const includeProperty: IncludePropertyInterface = {
      include: key,
      subIncludes: options?.subIncludes,
      endpoints: options?.endpoints ?? [ActionType.ALL],
    };
    target['__includeProperties'].push(includeProperty);
  };
}

export class ViceriIncludeParamService<T extends GenericModel> {
  private model: T;

  constructor(private readonly modelConstructor: new (...args: any[]) => T) {
    this.model = new this.modelConstructor();
  }

  getSubResourceIncludeParam(
    endpoints: ActionType[],
    include: Record<string, boolean>,
  ): Record<string, boolean> {
    if (this.model.__includeProperties) {
      for (const property of this.model.__includeProperties) {
        if (this.containsEndpoint(property, endpoints)) {
          const includeName: string = property.include;
          let includeValue: any = true;

          if (property.subIncludes !== undefined) {
            for (const subInclude of property.subIncludes) {
              includeValue = {
                ...includeValue,
                include: {
                  [subInclude]: true,
                },
              };
            }
          }

          include = { ...include, [includeName]: includeValue };
        }
      }
    }
    return include;
  }

  /**
   * Checks if a given property is associated with any of the specified endpoint types.
   *
   * @private
   * @param {any} property - The property to check.
   * @param {ActionType[]} endpoints - An array of action types to compare against.
   * @returns {boolean} `true` if the property is associated with any of the specified endpoints, otherwise `false`.
   */
  public containsEndpoint(property: any, endpoints: ActionType[]): boolean {
    if (property.endpoints?.includes(ActionType.ALL)) {
      return true;
    }

    return property.endpoints.some((endpoint: ActionType) =>
      endpoints.includes(endpoint),
    );
  }
}
