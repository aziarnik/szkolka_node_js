import { IDbConnection } from '../interfaces/i-db-connection';
import { AddAuthorizationTablesMigration } from './01-add-authorization-tables';

export const migrate = async function (connection: IDbConnection) {
  connection.queryWithoutParams(await AddAuthorizationTablesMigration.up());
};
