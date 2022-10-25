import { PasswordManagementHelper } from '../../helpers/password-management-helper';
import { PostgresBaseEntity } from './postgres-base-entity';

export class User extends PostgresBaseEntity {
  user_name: string;
  password: string;
  role: number;

  constructor(user: User) {
    super(user);
    this.user_name = user.user_name;
    this.password = user.password;
    this.role = user.role;
  }

  async checkIfPasswordIsCorrect(providedPassword: string): Promise<boolean> {
    return await PasswordManagementHelper.checkPassword(
      providedPassword,
      this.password
    );
  }

  async additionalWork(previousUserVersion: User) {
    if (previousUserVersion.password !== this.password) {
      this.password = await PasswordManagementHelper.hashPassword(
        this.password
      );
    }
  }
}
