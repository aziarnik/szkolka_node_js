import bcrypt from 'bcrypt';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { Configuration } from '../configuration/configuration';

export class PasswordManagementHelper {
  private static readonly bcryptRounds = 11;

  static hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(PasswordManagementHelper.bcryptRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return this.encrypthashedPasswordWithPepper(hashedPassword);
  };

  static checkPassword = async (
    password: string,
    hash: string
  ): Promise<boolean> => {
    return await bcrypt.compare(
      password,
      this.decryptHashedPasswordWithPepper(hash)
    );
  };

  private static getPasswordWithPepper = (password: string): string =>
    password.concat(Configuration.PASSWORD_PEPPER);

  private static encrypthashedPasswordWithPepper = (hash: string): string => {
    const initVector = randomBytes(16);
    const passwordBuffer = Buffer.from(Configuration.PASSWORD_PEPPER, 'hex');
    const cipherAlgorithm = createCipheriv(
      'aes-256-cbc',
      passwordBuffer,
      initVector
    );
    const encriptionPart = cipherAlgorithm.update(hash);
    const finalEncryption = Buffer.concat([
      encriptionPart,
      cipherAlgorithm.final()
    ]);
    return `${initVector.toString('hex')}:${finalEncryption.toString('hex')}`;
  };

  private static decryptHashedPasswordWithPepper = (
    encryptedPassword: string
  ): string => {
    const [initVector, encryptedHash] = encryptedPassword
      .split(':')
      .map((hex) => Buffer.from(hex, 'hex'));

    const decipherAlgorithm = createDecipheriv(
      'aes-256-cbc',
      Buffer.from(Configuration.PASSWORD_PEPPER, 'hex'),
      initVector
    );

    const decryptedPart = decipherAlgorithm.update(encryptedHash);
    const decryptedHash = Buffer.concat([
      decryptedPart,
      decipherAlgorithm.final()
    ]);
    return decryptedHash.toString();
  };
}
