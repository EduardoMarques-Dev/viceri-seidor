import { RoleType } from '@prisma/client';

export interface UserFromJwt {
  id: string;
  name: string;
  email: string;
  roles: RoleType[];
}
