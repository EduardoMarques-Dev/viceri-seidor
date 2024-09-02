import { Test, TestingModule } from '@nestjs/testing';
import {
  getMockTaskCreateDto,
  getMockTaskDto,
  getMockTaskModel,
  getMockTaskUpdateDto,
  getMockUserModel,
} from '../../generic-module/testing/mock.service';
import { TaskDto } from './model/dto/task.dto';
import { TaskModel } from './model/task.model';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  beforeEach(async () => {
    const mockTaskService = {
      genericFindFirst: jest.fn().mockResolvedValue({
        isPresent: jest.fn().mockReturnValue(true),
        get: jest.fn().mockReturnValue(getMockTaskModel()),
      }),
      genericCreate: jest.fn().mockResolvedValue(getMockTaskModel()),
      genericUpdate: jest.fn().mockResolvedValue({
        isPresent: jest.fn().mockReturnValue(true),
        get: jest.fn().mockReturnValue(getMockTaskModel()),
      }),
      genericDelete: jest.fn().mockResolvedValue(undefined),
      getModelConstructor: jest.fn().mockReturnValue(TaskModel),
      PrepareFindAllArgs: jest.fn().mockReturnValue({}),
      prepareFindFirstArgs: jest.fn().mockReturnValue({}),
      convertModelToDomain: jest.fn().mockReturnValue(getMockTaskModel()),
      PrepareCreateArgs: jest.fn().mockReturnValue({}),
      genericFindMany: jest.fn().mockResolvedValue([getMockTaskModel()]),
      convertToType: jest.fn().mockReturnValue(getMockTaskDto()),
      PrepareUpdateArgs: jest.fn().mockReturnValue({
        data: getMockTaskUpdateDto(),
        where: { id: 'task123' },
      }),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = moduleRef.get<TaskController>(TaskController);
    service = moduleRef.get<TaskService>(TaskService);
  });

  it('should return a list of pending tasks for the current user', async () => {
    const currentUser = getMockUserModel();

    const result = await controller.pendent(currentUser);

    expect(service.genericFindMany).toHaveBeenCalledWith({
      where: { user_id: currentUser.id, status: 'PENDENT' },
    });
    expect(service.convertToType).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(TaskDto);
  });

  it('should return a list of tasks based on query parameters', async () => {
    const take = 10;
    const skip = 0;
    const page = 1;

    const result = await controller.findAll(take, skip, page);

    expect(service.PrepareFindAllArgs).toHaveBeenCalledWith({
      returnType: TaskDto,
      take,
      skip,
    });
    expect(service.genericFindMany).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(TaskDto);
  });

  it('should return a task by ID', async () => {
    const taskId = 'task123';

    const result = await controller.findOne(taskId);

    expect(service.prepareFindFirstArgs).toHaveBeenCalledWith(taskId);
    expect(service.genericFindFirst).toHaveBeenCalled();
    expect(result).toBeInstanceOf(TaskDto);
  });

  it('should create a new task', async () => {
    const currentUser = getMockUserModel();
    const taskCreateDto = getMockTaskCreateDto();

    const result = await controller.create(currentUser, taskCreateDto);

    expect(service.PrepareCreateArgs).toHaveBeenCalled();
    expect(service.genericCreate).toHaveBeenCalled();
    expect(result).toBeInstanceOf(TaskDto);
  });

  // caduu
  it('should update a task by ID', async () => {
    const taskId = 'task123';
    const taskUpdateDto = getMockTaskUpdateDto();
    const taskModel = new TaskModel();

    jest.spyOn(service, 'convertModelToDomain').mockReturnValue(taskModel);

    const result = await controller.update(taskId, taskUpdateDto);

    expect(service.PrepareUpdateArgs).toHaveBeenCalledWith(taskModel, taskId);
    expect(service.genericUpdate).toHaveBeenCalled();
    expect(result).toBeInstanceOf(TaskDto);
  });

  it('should delete a task by ID', async () => {
    const taskId = 'task123';

    await controller.delete(taskId);

    expect(service.genericDelete).toHaveBeenCalledWith({
      where: { id: 'task123' },
    });
  });
});
