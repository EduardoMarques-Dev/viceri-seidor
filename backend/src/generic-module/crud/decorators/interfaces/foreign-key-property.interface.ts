import { GenericModelNames } from '../../../common/enum/generic-model-names.enum';

export interface ForeignKeyPropertyInterface {
  modelName: keyof typeof GenericModelNames;
  propertyName?: string;
}
