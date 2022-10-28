export interface IConnection {
  query(query: string, values: string[]): Promise<any>;
  query(query: string): Promise<any>;
  release(): void;
}
