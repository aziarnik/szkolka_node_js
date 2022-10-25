import { Pool, PoolClient } from 'pg';
import { PostgresDbConnection } from './postgres-db-connection';
import { IDbConnection } from './interfaces/i-db-connection';
import { Configuration } from '../configuration/configuration';
import { logger } from '../bunyan';

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

  static async runTransactionInPostgres(
    fn: (conn: IDbConnection) => Promise<void>
  ) {
    const connection = await DbConnectionFactory.getPostgresConnection();
    try {
      connection.beginTransation();
      await fn(connection);
      connection.commitTransaction();
    } catch (err) {
      connection.rollbackTransation();
      logger.error(err);
    } finally {
      connection.release();
    }
  }
}

class PostgresDbInstance {
  private static instance = new PostgresDbInstance(
    Configuration.POSTGRES_CONNECTION_STRING
  );

  private pool: Pool;

  private constructor(connectionString: string) {
    console.log(connectionString);
    this.pool = new Pool({ connectionString: connectionString });
  }

  static async getConnection(): Promise<PoolClient> {
    return await this.instance.pool.connect();
  }
}
