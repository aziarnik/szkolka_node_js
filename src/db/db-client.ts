import { Pool, PoolClient } from 'pg';
import config from 'config';
import { DbConnection } from './db-connection';

export class DbConnectionFactory {
  static async getPostgresConnection(): Promise<DbConnection> {
    return new DbConnection(await PostgresDbInstance.getConnection());
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
