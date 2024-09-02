import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ControllerOptions,
  ControllerOptionsBuilder,
} from '../../generic-module/common/builder/controller-options.builder';
import { GenericController } from '../../generic-module/crud/generic.controller';
import { Viceri_CurrentUser } from '../../security-module/decorators/current-user.decorator';
import { UserModel } from '../user/model/user.model';
import { TaskCreateDto } from './model/dto/task-create.dto';
import { TaskUpdateDto } from './model/dto/task-update.dto';
import { TaskDto } from './model/dto/task.dto';
import { TaskModel } from './model/task.model';
import { TaskService } from './task.service';

/**
 * Controller responsible for handling operations related to tasks.
 * This controller extends the `GenericController` to manage task-related CRUD operations.
 */
@ApiTags('task')
@Controller('task')
@ApiBearerAuth()
export class TaskController extends GenericController<TaskModel> {
  /**
   * Creates an instance of TaskController.
   *
   * @param {TaskService} taskService - The service responsible for handling task-related operations.
   */
  constructor(private readonly taskService: TaskService) {
    super(taskService);
  }

  /**
   * Retrieves tasks that are pending for the current user.
   *
   * @async
   * @param {UserModel} currentUser - The current user making the request.
   * @returns {Promise<TaskDto[]>} A Promise that resolves to an array of tasks with status 'PENDENT'.
   */
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved list of pending tasks.',
    type: [TaskDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
  })
  @Get('pendent')
  async pendent(
    @Viceri_CurrentUser() currentUser: UserModel,
  ): Promise<TaskDto[]> {
    const taskModels: TaskModel[] = await this.taskService.genericFindMany({
      where: { user_id: currentUser.id, status: 'PENDENT' },
    });

    return taskModels.map((model: any) => {
      return this.taskService.convertToType(TaskDto, model);
    });
  }

  /**
   * Retrieves a list of tasks based on the provided parameters.
   *
   * @async
   * @returns {Promise<TaskDto[]>} A Promise that resolves to an array of TaskDto objects.
   */
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Number of items to return.',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Number of items to skip.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved list of tasks.',
    type: [TaskDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
  })
  @Get()
  async findAll(
    @Query('take') take: number,
    @Query('skip') skip: number,
    @Query('page') page: number,
  ): Promise<TaskDto[]> {
    const options: ControllerOptions<TaskDto> =
      ControllerOptionsBuilder.returnType(TaskDto)
        .take(take)
        .skip(skip)
        .page(page)
        .build();
    return (await this.genericFindMany(options)) as TaskDto[];
  }

  /**
   * Retrieves a single task based on the provided unique identifier.
   *
   * @async
   * @param {string} id - The unique identifier for the task.
   * @returns {Promise<TaskDto>} A Promise that resolves to a TaskDto object.
   */
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the task.',
    type: TaskDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TaskDto> {
    return (await this.genericFindFirst(id, {
      returnType: TaskDto,
    })) as TaskDto;
  }

  /**
   * Creates a new task.
   *
   * @async
   * @param {TaskCreateDto} inputDto - The object containing the data to create the task.
   * @param {UserModel} currentUser - The current user making the request.
   * @returns {Promise<TaskDto>} A Promise that resolves to the created TaskDto object.
   */
  @ApiResponse({
    status: 201,
    description: 'Task successfully created.',
    type: TaskDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Validation failed.',
  })
  @Post()
  async create(
    @Viceri_CurrentUser() currentUser: UserModel,
    @Body() inputDto: TaskCreateDto,
  ): Promise<TaskDto> {
    const persistDto: TaskDto = {
      ...inputDto,
      id: undefined,
      status: undefined,
      user_id: currentUser.id,
    };

    return (await this.genericCreate(persistDto, {
      returnType: TaskDto,
    })) as TaskDto;
  }

  /**
   * Updates an existing task.
   *
   * @async
   * @param {string} id - The unique identifier for the task to be updated.
   * @param {TaskUpdateDto} model - The partial object containing the data to be updated.
   * @returns {Promise<TaskDto>} A Promise that resolves to the updated TaskDto object.
   */
  @ApiResponse({
    status: 200,
    description: 'Task successfully updated.',
    type: TaskDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Validation failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() model: TaskUpdateDto,
  ): Promise<TaskDto> {
    return (await this.genericUpdate(id, model, {
      returnType: TaskDto,
    })) as TaskDto;
  }

  /**
   * Deletes a task.
   *
   * @async
   * @param {string} id - The unique identifier for the task to be deleted.
   * @returns {Promise<void>} A Promise that resolves when the task record is deleted.
   */
  @ApiResponse({
    status: 204,
    description: 'Task successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.',
  })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.genericDelete(id);
  }
}
