import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LoggerService } from '../../generic-module/logger/logger.service';

import { PrismaService } from '../../database/prisma/prisma.service';
import { GenericService } from '../../generic-module/crud/generic.service';
import { TaskModel } from './model/task.model';

/**
 * Service responsible for handling operations related to tasks.
 * This service extends the `GenericService` to manage task-related CRUD operations.
 * It utilizes Prisma to interact with the database and manages the `TaskModel`.
 */
@Injectable()
export class TaskService extends GenericService<
  TaskModel,
  Prisma.test_taskFindManyArgs,
  Prisma.test_taskFindFirstArgs,
  Prisma.test_taskCreateArgs,
  Prisma.test_taskUpdateArgs
> {
  /**
   * Creates an instance of TaskService.
   *
   * @param prismaService - The Prisma service instance used for database interactions.
   * @param loggerService - The Logger service instance used for logging operations.
   */
  constructor(
    protected readonly prismaService: PrismaService,
    protected readonly loggerService: LoggerService,
  ) {
    super(TaskModel, prismaService, loggerService);
  }
}
