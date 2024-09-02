import { ChildPropertyInterface } from '../decorators/interfaces/child-property.interface';
import { CreatePropertyInterface } from '../decorators/interfaces/create-property.interface';
import { CryptoPropertyInterface } from '../decorators/interfaces/crypto-property.interface';
import { IncludePropertyInterface } from '../decorators/interfaces/include-property.interface';
import { ForeignKeyPropertyInterface } from './../decorators/interfaces/foreign-key-property.interface';

export abstract class GenericModel {
  id: string;
  customer_id?: string;

  __prismaSchemaName?: string;
  __entityName?: string;
  __includeProperties?: IncludePropertyInterface[];
  __createProperties?: CreatePropertyInterface[];
  __cryptoProperties?: CryptoPropertyInterface[];
  __deleteProperties?: ChildPropertyInterface[];
  __foreignKeyProperties?: ForeignKeyPropertyInterface[];
}
