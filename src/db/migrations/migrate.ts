import { DbInstance } from '../db-client';
import { InitialMigration } from './01-initial-migration';

export const migrate = async function () {
  const connection = await DbInstance.getConnection();
  connection.query(await InitialMigration.up());
  connection.release();
};
