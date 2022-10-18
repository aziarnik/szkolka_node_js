import { DbConnection } from '../db-connection';
import { InitialMigration } from './01-initial-migration';

export const migrate = async function (connection: DbConnection) {
  connection.queryWithoutParams(await InitialMigration.up());
};
