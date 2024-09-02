/**
 * Class representing a registry for storing and instantiating classes.
 *
 * This registry allows you to register classes by name and later create instances of those classes.
 */
class ClassRegistry {
  /**
   * A private record that stores the class constructors by their names.
   *
   * @private
   */
  private classes: Record<string, new () => any> = {};

  /**
   * Registers a class with a specified name.
   *
   * @param {string} className - The name of the class to register.
   * @param {new () => any} classConstructor - The constructor of the class to register.
   *
   * @example
   * classRegistry.register('MyClass', MyClass);
   */
  register(className: string, classConstructor: new () => any) {
    this.classes[className] = classConstructor;
  }

  /**
   * Creates an instance of a registered class based on its name.
   *
   * @param {string} className - The name of the class to instantiate.
   * @returns {any | null} An instance of the class if found, or `null` if the class is not registered.
   *
   * @example
   * const myClassInstance = classRegistry.createInstance('MyClass');
   */
  createInstance(className: string): any | null {
    const classConstructor = this.classes[className];
    if (classConstructor) {
      return new classConstructor();
    }
    return null; // Class not found
  }

  /**
   * Returns the list of registered class names.
   *
   * @returns {string[]} An array of registered class names.
   */
  getClassNames(): string[] {
    return Object.keys(this.classes);
  }
}

/**
 * Creates a singleton instance of the ClassRegistry.
 *
 * @type {ClassRegistry}
 */
const classRegistry: ClassRegistry = new ClassRegistry();

export default classRegistry;
