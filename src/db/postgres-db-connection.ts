import { errorMessages } from '../error-messages';
import { IConnection } from './interfaces/i-connection';
import { IDbConnection } from './interfaces/i-db-connection';

export class PostgresDbConnection implements IDbConnection {
  readonly connection: IConnection;
  private released = false;

  constructor(connection: IConnection) {
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
      `SELECT ${columns.join(',')} FROM ${tableName} WHERE id=$1;`,
      [id.toString()]
    );
    return result[0];
  }

  async firstById(
    id: number,
    tableName: string,
    columns: string[]
  ): Promise<unknown> {
    const result = await this.firstOrDefaultById(id, tableName, columns);
    if (!result) {
      throw Error(
        `${errorMessages.DB_ENTRY_NOT_EXIST} - table name: ${tableName}, id: ${id}`
      );
    }
    return result;
  }

  release() {
    if (!this.released) {
      this.connection.release();
      this.released = true;
    }
  }
}
