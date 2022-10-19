import { IDbConnection } from '../interfaces/i-db-connection';
import { InitialMigration } from './01-initial-migration';

export const migrate = async function (connection: IDbConnection) {
  connection.queryWithoutParams(await InitialMigration.up());
};
