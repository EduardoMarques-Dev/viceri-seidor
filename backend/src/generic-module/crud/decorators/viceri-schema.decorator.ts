import classRegistry from './class-registry.handler';

/**
 * Decorator responsible for storing basic entity information for the generic context, such as the Prisma schema name and the class name.
 *
 * @param {string} schemaName - The name of the Prisma schema associated with the entity.
 * @returns {Function} A decorator function to be used on entity classes.
 */
export function Viceri_Schema(schemaName: string): (target: any) => void {
  return (target: any) => {
    /**
     * Registers the class in the class registry and assigns the Prisma schema name and entity name to the class prototype.
     */
    classRegistry.register(target.name, target);

    /**
     * Assigns Prisma schema name and entity name to the class prototype
     */
    Object.assign(target.prototype, {
      __prismaSchemaName: schemaName,
      __entityName: target.name,
    });
  };
}
