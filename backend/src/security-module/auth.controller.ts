import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { Viceri_CurrentUser } from './decorators/current-user.decorator';
import { Viceri_IsPublic } from './decorators/is-public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './interfaces/auth-request.interface';
import { LoginRequestBody } from './models/login-request-body.dto';
import { UserPayload } from './models/user-payload.dto';
import { UserToken } from './models/user-token.dto';

@ApiTags('login')
@Controller()
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  // step 1
  @Viceri_IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginRequestBody })
  @UseGuards(LocalAuthGuard)
  login(@Request() req: AuthRequest): UserToken {
    return this.AuthService.login(req.user);
  }

  @Get('me')
  getMe(@Viceri_CurrentUser() user: UserPayload): UserPayload {
    return user;
  }
}
