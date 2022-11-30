import { IStarlinkEntryData, Starlink } from '../entities/starlink';
import { IDbConnection } from '../interfaces/i-db-connection';
import { BaseRepository } from './base-repository';

export class StarlinkRepository extends BaseRepository<
  Starlink,
  IStarlinkEntryData
> {
  protected tableName = 'starlinks';
  protected tableSchema = 'spacex';
  protected columns: string[] = ['id', 'value', 'deleted_at'];

  private isNotDeletedContraint = 'deleted_on is NULL';
  protected entityType: new (starlink: IStarlinkEntryData) => Starlink;

  constructor(conn: IDbConnection) {
    super(conn);
    this.entityType = Starlink;
  }

  async isAny(): Promise<boolean> {
    const response = await this.dbConnection.queryWithoutParams(
      `SELECT id FROM ${this.tableSchema}.${this.tableName} limit 1`
    );

    if (!response || response.length === 0) {
      return false;
    } else {
      return true;
    }
  }

  async multipleInserts(starlinksData: any[]) {
    let iterator = 1;
    let insertStatement = '';
    starlinksData.forEach((starlink, index, array) => {
      if (index !== array.length - 1) {
        insertStatement += `($${iterator++}), `;
      } else {
        insertStatement += `($${iterator++})`;
      }
    });
    const stringifiedStarlinks = starlinksData.map((starlink) =>
      JSON.stringify(starlink)
    );

    const query = `INSERT INTO ${this.tableSchema}.${this.tableName}(value) VALUES ${insertStatement}`;

    await this.dbConnection.query(query, stringifiedStarlinks);
  }

  async softDelete(starlinkId: number) {
    this.dbConnection.command(
      `UPDATE ${this.tableSchema}.${this.tableName} SET deleted_at=NOW() WHERE id=$1`,
      [starlinkId.toString()]
    );
  }

  async getStarlinksNewerThan(transactionId: number): Promise<Starlink[]> {
    return (
      await this.dbConnection.query(
        `SELECT xmin, id, value, deleted_at FROM ${this.tableSchema}.${this.tableName} WHERE xmin::text::bigint > $1`,
        [transactionId.toString()]
      )
    ).map((starlink) => new this.entityType(starlink as IStarlinkEntryData));
  }
}
