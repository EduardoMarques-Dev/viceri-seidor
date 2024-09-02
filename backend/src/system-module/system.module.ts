import { Module } from "@nestjs/common";
import { GenericModule } from "../generic-module/generic.module";
import { TaskModule } from "./task/task.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    GenericModule, UserModule, TaskModule
  ],
  controllers: [],
  providers: [],
  exports: [UserModule, TaskModule],
})
export class SystemModule{
}
