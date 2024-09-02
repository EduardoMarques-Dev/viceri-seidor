import { RoleType, test_user } from '@prisma/client';
import { Viceri_Include_Param } from '../../../generic-module/crud/decorators/param/viceri-include-param.decorator';
import { Viceri_Crypto_Transform } from '../../../generic-module/crud/decorators/transform/viceri-crypto-transform.decorator';
import { Viceri_Schema } from '../../../generic-module/crud/decorators/viceri-schema.decorator';
import { ActionType } from '../../../generic-module/crud/enum/endpoint.enum';
import { GenericModel } from '../../../generic-module/crud/model/generic.model';
import { TaskModel } from '../../task/model/task.model';

/**
 * Domain model of a user.
 */
@Viceri_Schema('test_user')
export class UserModel implements GenericModel, test_user {
  /**
   * The unique identifier for the user.
   * @example '3f68087e-42dd-491b-b68f-87bb773ae5d1'
   */
  id: string;

  /**
   * The first name of the user.
   * @example 'Harry'
   */
  name: string;

  /**
   * The email address of the user.
   * @example 'user@example.com'
   */
  email: string;

  /**
   * The password for the user's account.
   *
   * **Password requirements:**
   * - Minimum of 4 characters
   * - Maximum of 20 characters
   * - Must contain at least one special character
   * - Must contain at least one uppercase letter
   * - Must contain at least one lowercase letter
   * - No spaces allowed
   *
   * @example 'Password123!'
   */
  @Viceri_Crypto_Transform({ isHash: true })
  password: string;

  /**
   * The roles assigned to the user.
   * @example ['ADMIN']
   */
  roles: RoleType[];

  /**
   * The tasks assigned to the user.
   * @example [{
    id: '3f68087e-42dd-491b-b68f-87bb773ae5d1',
    user_id: '3f68087e-42dd-491b-b68f-87bb773ae5d1',
    description: 'Complete the project A',
    priority: PriorityType.HIGH,
    status: StatusType.PENDENT,
  }]
   */
  @Viceri_Include_Param({ endpoints: [ActionType.GET_ONE] })
  tasks: TaskModel[];
}
