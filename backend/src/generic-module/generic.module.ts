import { Module } from '@nestjs/common';

import { PrismaService } from '../database/prisma/prisma.service';
import { ApiCheckHealthController } from './check-health/api-check-health.controller';
import { LoggerService } from './logger/logger.service';

@Module({
  imports: [], //CaslModule],
  controllers: [ApiCheckHealthController],
  providers: [PrismaService, LoggerService],
  exports: [PrismaService, LoggerService], //CaslModule],
})
export class GenericModule {}
