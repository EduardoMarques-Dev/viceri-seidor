import { GenericModel } from '../../model/generic.model';
import { CreatePropertyInterface } from '../interfaces/create-property.interface';

/**
 * Decorator used to create subresources in a nested manner, in conjunction with the parent class.
 *
 * @param {CreatePropertyInterface} options - Options for creating subresources.
 * @returns {Function} A decorator function to be used on class properties.
 */
export function Viceri_Create_Param(
  options?: CreatePropertyInterface,
): (target: any, key: string) => void {
  return (target: any, key: string) => {
    /**
     * Verifies if the class has a '__createProperties' property.
     * If not, it initializes the property as an empty array.
     */
    if (!target.hasOwnProperty('__createProperties')) {
      Object.defineProperty(target, '__createProperties', {
        value: [],
        configurable: false,
        enumerable: false,
        writable: false,
      });
    }

    /**
     * Stores the details of the property in the '__createProperties' array.
     */
    const createProperty: CreatePropertyInterface = {
      name: key,
      subCreates: options?.subCreates,
    };
    target['__createProperties'].push(createProperty);
  };
}

export class ViceriCreateParamService<T extends GenericModel> {
  private contextModel: T;

  constructor(private readonly modelConstructor: new (...args: any[]) => T) {
    this.contextModel = new this.modelConstructor();
  }

  getSubResourceCreateParam(model: Partial<T>): Partial<T> {
    if (this.contextModel.__createProperties) {
      for (const property of this.contextModel.__createProperties) {
        if (model[property.name]) {
          if (
            Array.isArray(model[property.name]) &&
            model[property.name].length > 1
          ) {
            model[property.name] = {
              createMany: {
                data: model[property.name],
              },
            };
          } else {
            if (Array.isArray(model[property.name])) {
              model[property.name] = {
                create: model[property.name][0],
              };
            } else {
              model[property.name] = {
                create: model[property.name],
              };
            }

            if (property.subCreates !== undefined) {
              for (const subCreate of property.subCreates) {
                if (model[property.name].create[subCreate]) {
                  if (Array.isArray(model[property.name].create[subCreate])) {
                    model[property.name].create[subCreate] = {
                      createMany: {
                        data: model[property.name].create[subCreate],
                      },
                    };
                  } else {
                    model[property.name].create[subCreate] = {};
                  }
                }
              }
            }
          }
        }
      }
    }

    return model;
  }
}
