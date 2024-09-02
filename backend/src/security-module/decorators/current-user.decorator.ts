import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '../interfaces/auth-request.interface';
import { UserModel } from './../../system-module/user/model/user.model';

export const Viceri_CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserModel => {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    return request.user;
  },
);
