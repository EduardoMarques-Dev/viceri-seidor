import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LoggerService } from '../../generic-module/logger/logger.service';

import { PrismaService } from '../../database/prisma/prisma.service';
import { GenericService } from '../../generic-module/crud/generic.service';
import { UserModel } from './model/user.model';

/**
 * Service responsible for handling operations related to users.
 * This service extends the `GenericService` to inherit common CRUD operations.
 * It utilizes Prisma to interact with the database and manages the `UserModel`.
 */
@Injectable()
export class UserService extends GenericService<
  UserModel,
  Prisma.test_userFindManyArgs,
  Prisma.test_userFindFirstArgs,
  Prisma.test_userCreateArgs,
  Prisma.test_userUpdateArgs
> {
  /**
   * Creates an instance of UserService.
   *
   * @param prismaService - The Prisma service instance used for database interactions.
   * @param loggerService - The Logger service instance used for logging operations.
   */
  constructor(
    protected readonly prismaService: PrismaService,
    protected readonly loggerService: LoggerService,
  ) {
    super(UserModel, prismaService, loggerService);
  }
}
