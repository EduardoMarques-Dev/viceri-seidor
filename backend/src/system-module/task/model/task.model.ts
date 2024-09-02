import { PriorityType, StatusType, test_task } from '@prisma/client';
import { Viceri_Key_Validation } from '../../../generic-module/crud/decorators/validation/viceri-key-validation.decorator';
import { Viceri_Schema } from '../../../generic-module/crud/decorators/viceri-schema.decorator';
import { GenericModel } from '../../../generic-module/crud/model/generic.model';

/**
 * Domain model of a task.
 */
@Viceri_Schema('test_task')
export class TaskModel implements GenericModel, test_task {
  /**
   * The unique identifier for the task.
   * @example '3f68087e-42dd-491b-b68f-87bb773ae5d1'
   */
  id: string;

  /**
   * The unique identifier of the task user (UUID format).
   * @example '3f68087e-42dd-491b-b68f-87bb773ae5d1'
   */
  @Viceri_Key_Validation({ modelName: 'UserModel' })
  user_id: string;

  /**
   * The description of the task.
   * @example 'Complete the project A'
   */
  description: string;

  /**
   * The priority of the task.
   * @example PriorityType.HIGH
   */
  priority: PriorityType;

  /**
   * The status of the task.
   * @example StatusType.PENDENT
   */
  status: StatusType;
}
