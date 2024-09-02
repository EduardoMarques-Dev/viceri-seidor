import { Module } from '@nestjs/common';
import { GenericModule } from '../../generic-module/generic.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [GenericModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
