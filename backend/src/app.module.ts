import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExceptionHandlingFilter } from './generic-module/exception/exception-handling.filter';
import { GenericModule } from './generic-module/generic.module';
import { LoggingInterceptor } from './generic-module/logger/logging.interceptor';
import { AuthModule } from './security-module/auth.module';
import { JwtAuthGuard } from './security-module/guards/jwt-auth.guard';
import { SystemModule } from './system-module/system.module';

@Module({
  imports: [GenericModule, AuthModule, SystemModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionHandlingFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
