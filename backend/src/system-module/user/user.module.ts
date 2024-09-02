import { Module } from '@nestjs/common';
import { GenericModule } from '../../generic-module/generic.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [GenericModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
