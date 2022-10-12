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

  async query(query: string, values: string[]): Promise<unknown[]> {
    const result = await this.connection.query(query, values);

    return result.rows;
  }

  async queryWithoutParams(query: string): Promise<any[]> {
    const result = await this.connection.query(query);

    return result.rows;
  }

  async command(query: string, values: string[]) {
    await this.connection.query(query, values);
  }

  async firstOrDefaultById(
    id: number,
    tableName: string,
    columns: string[]
  ): Promise<unknown> {
    const result = await this.query(
      `SELECT ${columns.join(',')} FROM public.${tableName} WHERE id=$1;`,
      [id.toString()]
    );

    return result[0];
  }
}