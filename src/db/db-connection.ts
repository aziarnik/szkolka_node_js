import { PoolClient } from 'pg';

export class DbConnection {
  readonly connection: PoolClient;
  constructor(connection: PoolClient) {
    this.connection = connection;
  }

  beginTransation(): void {
    this.connection.query('BEGIN');
  }

  commitTransaction(): void {
    this.connection.query('COMMIT');
  }

  rollbackTransation(): void {
    this.connection.query('ROLLBACK');
  }
}
