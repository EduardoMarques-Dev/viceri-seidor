import { RoleType } from '@prisma/client';

export class UserPayload {
  sub: string;
  name: string;
  email: string;
  roles: RoleType[];
  iat?: number;
  exp?: number;
}
