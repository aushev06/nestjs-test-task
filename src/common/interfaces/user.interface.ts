import { Roles } from '../../entities/user.entity';

export interface UserInterface {
  sub: string;
  role: Roles;
  email: string;
}
