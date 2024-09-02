import * as bcrypt from 'bcrypt';
import * as cryptoJS from 'crypto-js';
import { GenericModel } from '../../model/generic.model';
import { CryptoPropertyInterface } from '../interfaces/crypto-property.interface';

/**
 * Decorator responsável por definir uma propriedade da classe para criptografia ou hashing.
 *
 * @param isHash - Indica se a propriedade deve ser armazenada como um hash.
 * @returns {Function} Uma função decoradora para ser usada em propriedades da classe.
 */
export function Viceri_Crypto_Transform(
  options: CryptoPropertyInterface,
): (target: any, key: string) => void {
  return (target: any, key: string) => {
    if (!target.hasOwnProperty('__cryptoProperties')) {
      Object.defineProperty(target, '__cryptoProperties', {
        value: [],
        configurable: false,
        enumerable: false,
        writable: false,
      });
    }

    const cryptoProperty: CryptoPropertyInterface = {
      name: key,
      isHash: options.isHash ?? false,
    };
    target['__cryptoProperties'].push(cryptoProperty);
  };
}

export class ViceriCryptoTransformService {
  async encrypt(contextModel: GenericModel, params: any): Promise<void> {
    if (contextModel.__cryptoProperties) {
      for (const property of contextModel.__cryptoProperties) {
        if (params.data[property.name]) {
          if (property.isHash) {
            const saltRounds = 10;
            const hash = await bcrypt.hash(
              params.data[property.name],
              saltRounds,
            );
            params.data[property.name] = hash;
          } else {
            const ciphertext = cryptoJS.AES.encrypt(
              params.data[property.name],
              process.env.CRYPTO,
            ).toString();
            params.data[property.name] = ciphertext;
          }
        }
      }
    }
  }

  async decrypt(
    contextModel: GenericModel,
    entity: GenericModel | GenericModel[],
  ): Promise<void> {
    if (contextModel.__cryptoProperties) {
      if (Array.isArray(entity)) {
        for (const singleEntity of entity) {
          this.decryptOne(contextModel, singleEntity);
        }
      } else {
        this.decryptOne(contextModel, entity);
      }
    }
  }

  private decryptOne(contextModel: GenericModel, entity: GenericModel) {
    for (const property of contextModel.__cryptoProperties) {
      if (entity && entity[property.name]) {
        if (!property.isHash) {
          const bytes = cryptoJS.AES.decrypt(
            entity[property.name],
            process.env.CRYPTO,
          );
          const decryptedValue = bytes.toString(cryptoJS.enc.Utf8);
          entity[property.name] = decryptedValue;
        }
      }
    }
  }

  ignoreEncrypted(contextModel: GenericModel, result: any): void {
    if (contextModel.__cryptoProperties) {
      for (const property of contextModel.__cryptoProperties) {
        if (Array.isArray(result)) {
          for (const resultItem of result) {
            if (resultItem[property.name]) {
              if (!property.isHash) {
                resultItem[property.name] = undefined;
              }
            }
          }
        } else {
          if (result[property.name]) {
            if (!property.isHash) {
              result[property.name] = undefined;
            }
          }
        }
      }
    }
  }
}

export enum EncryptionReturnType {
  Ignore = 'ignore',
  Show = 'show',
  Decrypt = 'decrypt',
}
