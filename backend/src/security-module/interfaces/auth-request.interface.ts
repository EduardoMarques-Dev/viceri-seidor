import { UserModel } from '../../system-module/user/model/user.model';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user: UserModel;
}
