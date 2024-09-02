import { ActionType } from '../../enum/endpoint.enum';

export interface IncludePropertyInterface {
  subIncludes?: string[];
  endpoints?: ActionType[];
  include?: string; // Nome da propriedade
}
