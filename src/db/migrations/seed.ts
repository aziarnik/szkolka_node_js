import { readSqlFileText } from '../helpers/read-sql-script-helper';
import { IDbConnection } from '../interfaces/i-db-connection';

export const seed = async function (connection: IDbConnection) {
  connection.queryWithoutParams(await seedQuery());
};

const seedQuery = async function (): Promise<string> {
  return await readSqlFileText('seed-db.sql');
};
