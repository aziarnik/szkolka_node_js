import { Pool, PoolClient } from 'pg';
import config from 'config';

export class DbInstance {
  private static instance = new DbInstance();

  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      user: config.get('db.user'),
      host: config.get('db.host'),
      database: config.get('db.database'),
      password: config.get('db.password'),
      port: config.get('db.port')
    });
  }

  static getInstance(): DbInstance {
    return this.instance;
  }

  static getPool(): Pool {
    return this.instance.pool;
  }

  static async getConnection(): Promise<PoolClient> {
    return await this.instance.pool.connect();
  }
}
