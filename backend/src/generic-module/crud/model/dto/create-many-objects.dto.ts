import { ApiProperty } from '@nestjs/swagger';
import { GenericModel } from '../generic.model';

export class CreateManyObjects<TModel extends GenericModel> {
  @ApiProperty({ type: () => Array<GenericModel> })
  successes: TModel[];
  failures: Error[];
}
