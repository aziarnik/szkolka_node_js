import { readSqlFileText } from '../helpers/read-sql-script-helper';

export class AddSpacexTable {
  static up = async (): Promise<string> => {
    return await readSqlFileText('02-add-spacex-table-up.sql');
  };

  static down = async (): Promise<string> => {
    return await readSqlFileText('02-add-spacex-table-down.sql');
  };
}
