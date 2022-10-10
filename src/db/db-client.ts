import { Pool, PoolClient } from 'pg';

export class DbInstance {
  private static instance = new DbInstance();

  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      user: 'db_admin',
      host: 'localhost',
      database: 'szkolka_node_js',
      password: 'password',
      port: 5431
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
