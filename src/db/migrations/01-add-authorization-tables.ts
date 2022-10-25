import { readSqlFileText } from '../helpers/read-sql-script-helper';

export class AddAuthorizationTablesMigration {
  static up = async (): Promise<string> => {
    return await readSqlFileText('01-add-authorization-tables-up.sql');
  };

  static down = async (): Promise<string> => {
    return await readSqlFileText('01-add-authorization-tables-down.sql');
  };
}
