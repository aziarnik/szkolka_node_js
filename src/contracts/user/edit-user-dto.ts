import { Role } from '../../enums/user-role';

export interface EditUserDto {
  userId: number;
  password: string;
  role: Role;
  userName: string;
}
