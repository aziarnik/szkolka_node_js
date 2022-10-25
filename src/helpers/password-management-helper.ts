import bcrypt from 'bcrypt';
import { Configuration } from '../configuration/configuration';

export class PasswordManagementHelper {
  private static readonly bcryptRounds = 11;

  static hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(PasswordManagementHelper.bcryptRounds);
    const hashedPassword = await bcrypt.hash(
      PasswordManagementHelper.getPasswordWithPepper(password),
      salt
    );
    return hashedPassword;
  };

  static checkPassword = async (
    password: string,
    hash: string
  ): Promise<boolean> => {
    return await bcrypt.compare(
      PasswordManagementHelper.getPasswordWithPepper(password),
      hash
    );
  };

  private static getPasswordWithPepper = (password: string): string =>
    password.concat(Configuration.PASSWORD_PEPPER);
}
