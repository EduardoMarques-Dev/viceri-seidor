import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Viceri_IsPublic } from '../../security-module/decorators/is-public.decorator';

/**
 * Controller responsible for handling operations related to api credentials.
 */
@Controller()
@ApiTags('check-health')
export class ApiCheckHealthController {
  @Viceri_IsPublic()
  @Get('check-health')
  getHealth() {
    const healthStatus = {
      status: 'ok',
      timestamp: new Date(),
    };
    return healthStatus;
  }
}
