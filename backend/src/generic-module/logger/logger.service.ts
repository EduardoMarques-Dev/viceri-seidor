import { Injectable } from '@nestjs/common';
import { Logger, createLogger } from 'winston';
import { buildDevLogger } from './config/dev-logger.config';
import { buildQaLogger } from './config/qa-logger.config';

@Injectable()
export class LoggerService {
  private readonly logger: Logger;
  private context: string;

  constructor() {
    if (process.env.ENVIROMENT === 'DEV') {
      this.logger = createLogger(buildDevLogger());
    } else {
      this.logger = createLogger(buildQaLogger());
    }
  }

  log(...args: any[]) {
    const message = this.prepareMessage(args);

    this.logger.info(message, { context: this.context });
  }

  error(...args: any[] | Error[]) {
    const message = this.prepareMessage(args);

    this.logger.error(message);
  }

  warn(...args: any[]) {
    const message = this.prepareMessage(args);

    this.logger.warn(message, { context: this.context });
  }

  http(...args: any[]) {
    const message = this.prepareMessage(args);

    this.logger.http(message, { context: this.context });
  }

  verbose(...args: any[]) {
    const message = this.prepareMessage(args);

    this.logger.verbose(message, { context: this.context });
  }

  debug(...args: any[]) {
    const message = this.prepareMessage(args);

    this.logger.debug(message, { context: this.context });
  }

  silly(...args: any[]) {
    const message = this.prepareMessage(args);

    this.logger.silly(message, { context: this.context });
  }

  clearContext() {
    this.context = '';
  }
  setContext(contextMessage: string) {
    this.context = contextMessage;
  }

  /**
   * Prepares a single message string from multiple arguments.
   * This method takes an array of any type of arguments and
   * returns a single string with each argument converted to a string and separated by commas.
   *
   * @param args - Array of any type of elements (string, number, object, etc.).
   *               This allows for flexible input similar to how `console.log` handles multiple arguments.
   * @returns A string where each element of `args` is converted to a string.
   *          If an element is an object, it is converted to a JSON string.
   *          Other types of elements are converted to their string representations.
   *          All elements are concatenated into a single string separated by commas.
   *
   * Example usage:
   *   prepareMessage(["Hello", 123, true, { key: "value" }])
   *   // Returns: 'Hello, 123, true, {"key":"value"}'
   */
  private prepareMessage(args: any[]): string {
    return args
      .map((arg) => {
        if (typeof arg === 'object') {
          // Converts object to JSON string representation
          return JSON.stringify(arg);
        } else {
          // Converts other types (number, string, etc.) to string
          return String(arg);
        }
      })
      .join(', ');
  }
}
