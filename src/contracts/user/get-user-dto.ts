import { User } from '../../db/entities/user';
import { Role } from '../../enums/user-role';

export class GetUserDto {
  id: number;
  role: Role;
  user_name: string;

  constructor(user: User) {
    this.id = user.id;
    this.role = user.role;
    this.user_name = user.user_name;
  }
}
