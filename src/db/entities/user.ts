import { Role } from '../../enums/user-role';
import { PasswordManagementHelper } from '../../helpers/password-management-helper';
import {
  editUserSchema,
  editUserSchemaWithoutPassword
} from '../../joi-schemas/user-schema';
import {
  IPostrgesBaseEntryData,
  PostgresBaseEntity
} from './postgres-base-entity';

export class User extends PostgresBaseEntity {
  user_name: string;
  password: string;
  role: Role;

  constructor(user: IUserEntryData) {
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

  private async hashPassword() {
    this.password = await PasswordManagementHelper.hashPassword(this.password);
  }

  async validateAsync(oldUser: User): Promise<void> {
    if (oldUser.password !== this.password) {
      await editUserSchema.validateAsync(this);
      await this.hashPassword();
    } else {
      await editUserSchemaWithoutPassword.validateAsync(this);
    }
  }

  validateTransactionId(xminFromRequest: number): boolean {
    return this.xmin === xminFromRequest;
  }
}

export interface IUserEntryData extends IPostrgesBaseEntryData {
  user_name: string;
  password: string;
  role: number;
}
