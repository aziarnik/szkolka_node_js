import { Pool, PoolClient } from 'pg';
import config from 'config';
import { PostgresDbConnection } from './postgres-db-connection';
import { IDbConnection } from './interfaces/i-db-connection';

export class DbConnectionFactory {
  static async getPostgresConnection(): Promise<IDbConnection> {
    return new PostgresDbConnection(await PostgresDbInstance.getConnection());
  }
}

export class DbConnectionWrapper {
  static async runInPostgres(
    fn: (conn: IDbConnection) => Promise<void>
  ): Promise<void> {
    const connection = await DbConnectionFactory.getPostgresConnection();
    await fn(connection);
    connection.release();
  }
}

class PostgresDbInstance {
  private static instance = new PostgresDbInstance(
    config.get('connectionStrings.postgreSql')
  );

  private pool: Pool;

  private constructor(connectionString: string) {
    this.pool = new Pool({ connectionString: connectionString });
  }

  static async getConnection(): Promise<PoolClient> {
    return await this.instance.pool.connect();
  }
}
