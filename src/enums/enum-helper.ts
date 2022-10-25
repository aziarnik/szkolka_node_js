import { Role } from './user-role';

export class EnumHelper {
  static getRoleNumericValue(role: Role): number {
    return Number(role);
  }
}
