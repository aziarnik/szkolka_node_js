import { readSqlFileText } from '../helpers/read-sql-script-helper';

export class InitialMigration {
  static up = async (): Promise<string> => {
    return await readSqlFileText('01-initial-migration-up.sql');
  };

  static down = async (): Promise<string> => {
    return await readSqlFileText('01-initial-migration-down.sql');
  };
}
