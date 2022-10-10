import { DbInstance } from '../db-client';
import { readSqlFileText } from '../helpers/read-sql-script-helper';

export const seed = async function () {
  const connection = await DbInstance.getConnection();
  connection.query(await seedQuery());
};

const seedQuery = async function (): Promise<string> {
  return await readSqlFileText('seed-db.sql');
};
