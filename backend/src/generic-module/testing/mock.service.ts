import { PriorityType, RoleType, StatusType } from '@prisma/client';
import { TaskCreateDto } from '../../system-module/task/model/dto/task-create.dto';
import { TaskUpdateDto } from '../../system-module/task/model/dto/task-update.dto';
import { TaskDto } from '../../system-module/task/model/dto/task.dto';
import { TaskModel } from '../../system-module/task/model/task.model';
import { UserCreateDto } from '../../system-module/user/model/dto/user-create.dto';
import { UserUpdateDto } from '../../system-module/user/model/dto/user-update.dto';
import { UserDto } from '../../system-module/user/model/dto/user.dto';
import { UserModel } from '../../system-module/user/model/user.model';

export function getMockUserModel(): UserModel {
  return Object.assign(new UserModel(), {
    id: '3f68087e-42dd-491b-b68f-87bb773ae5d1',
    name: 'Harry',
    email: 'user@example.com',
    password: 'Password123!',
    roles: [RoleType.USER],
  });
}

export function getMockUserDto(): UserDto {
  return Object.assign(new UserDto(), {
    isDto: true,
    id: '3f68087e-42dd-491b-b68f-87bb773ae5d1',
    name: 'Harry',
    email: 'user@example.com',
    password: 'Password123!',
    roles: [RoleType.USER],
  });
}

export function getMockUserCreateDto(): UserCreateDto {
  return Object.assign(new UserCreateDto(), {
    isDto: true,
    name: 'Harry',
    email: 'user@email.com',
    password: 'Password123!',
    roles: [RoleType.USER],
  });
}

export function getMockUserUpdateDto(): UserUpdateDto {
  return Object.assign(new UserUpdateDto(), {
    isDto: true,
    name: 'Harry',
    email: 'user@email.com',
    password: 'Password123!',
    roles: [RoleType.USER],
  });
}

export function getMockTaskModel(): TaskModel {
  return Object.assign(new TaskModel(), {
    id: '3f68087e-42dd-491b-b68f-87bb773ae5d1',
    user_id: '3f68087e-42dd-491b-b68f-87bb773ae5d1',
    description: 'Complete the project A',
    priority: PriorityType.HIGH,
    status: StatusType.PENDENT,
  });
}

export function getMockTaskDto(): TaskDto {
  return Object.assign(new TaskDto(), {
    isDto: true,
    id: '3f68087e-42dd-491b-b68f-87bb773ae5d1',
    user_id: '3f68087e-42dd-491b-b68f-87bb773ae5d1',
    description: 'Complete the project A',
    priority: PriorityType.HIGH,
    status: StatusType.PENDENT,
  });
}

export function getMockTaskUpdateDto(): TaskUpdateDto {
  return Object.assign(new TaskUpdateDto(), {
    isDto: true,
    description: 'Complete the project A',
    priority: PriorityType.HIGH,
    status: StatusType.PENDENT,
  });
}

export function getMockTaskCreateDto(): TaskCreateDto {
  return {
    isDto: true,
    description: 'Complete the project A',
    priority: PriorityType.HIGH,
  };
}
