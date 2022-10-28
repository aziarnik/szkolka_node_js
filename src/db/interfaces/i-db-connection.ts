import { IConnection } from './i-connection';

export interface IDbConnection {
  connection: IConnection;
  beginTransation(): void;
  commitTransaction(): void;
  rollbackTransation(): void;
  query(query: string, values: string[]): Promise<unknown[]>;
  queryWithoutParams(query: string): Promise<any[]>;
  command(query: string, values: string[]): Promise<any>;
  firstOrDefaultById(
    id: number,
    tableName: string,
    columns: string[]
  ): Promise<unknown>;
  firstById(id: number, tableName: string, columns: string[]): Promise<unknown>;
  release(): void;
}
