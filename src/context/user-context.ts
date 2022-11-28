import { Role } from '../enums/user-role';
import { RefreshToken } from '../value-objects/refresh-token';

export class UserContext {
  id: number;
  email: string;
  refreshToken: RefreshToken;
  role: Role;

  constructor(userContext: IUserContextEntry) {
    this.id = userContext.id;
    this.email = userContext.email;
    this.refreshToken = RefreshToken.create(userContext.refreshToken);
    this.role = userContext.role;
  }

  isAdmin = () => this.role === Role.Admin;

  isUser = () => this.role === Role.Admin || this.role === Role.User;
}

export interface IUserContextEntry {
  id: number;
  email: string;
  refreshToken: string;
  role: Role;
}
