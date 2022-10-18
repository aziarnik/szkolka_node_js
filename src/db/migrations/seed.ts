import { DbConnection } from '../db-connection';
import { readSqlFileText } from '../helpers/read-sql-script-helper';

export const seed = async function (connection: DbConnection) {
  connection.queryWithoutParams(await seedQuery());
};

const seedQuery = async function (): Promise<string> {
  return await readSqlFileText('seed-db.sql');
};
