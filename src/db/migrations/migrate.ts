import { IDbConnection } from '../interfaces/i-db-connection';
import { AddAuthorizationTablesMigration } from './01-add-authorization-tables';
import { AddSpacexTable } from './02-add-spacex-table';

export const migrate = async function (connection: IDbConnection) {
  connection.queryWithoutParams(await AddAuthorizationTablesMigration.up());
  connection.queryWithoutParams(await AddSpacexTable.up());
};
