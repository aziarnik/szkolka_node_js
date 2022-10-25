import { PostgresBaseEntity } from '../entities/postgres-base-entity';
import { IDbConnection } from '../interfaces/i-db-connection';
import { BaseRepositoryHelper } from './base-repository-helper';

export abstract class BaseRepository<Entity extends PostgresBaseEntity> {
  protected readonly dbConnection: IDbConnection;
  protected abstract tableSchema: string;
  protected abstract tableName: string;
  protected abstract columns: string[];

  protected systemColumns: string[] = ['xmin'];
  protected abstract entityType: new (entity: Entity) => Entity;

  constructor(conn: IDbConnection) {
    this.dbConnection = conn;
  }

  async firstOrDefaultById(id: number): Promise<Entity> {
    return new this.entityType(
      (await this.dbConnection.firstOrDefaultById(
        id,
        `${this.tableSchema}.${this.tableName}`,
        this.columns.concat(this.systemColumns)
      )) as Entity
    );
  }

  async firstById(id: number): Promise<Entity> {
    return new this.entityType(
      (await this.dbConnection.firstById(
        id,
        `${this.tableSchema}.${this.tableName}`,
        this.columns.concat(this.systemColumns)
      )) as Entity
    );
  }

  async getAll(): Promise<Entity[]> {
    return (
      await this.dbConnection.queryWithoutParams(
        `SELECT ${this.columns}, ${this.systemColumns} FROM ${this.tableSchema}.${this.tableName};`
      )
    ).map((x) => new this.entityType(x));
  }

  async delete(id: number): Promise<void> {
    await this.dbConnection.command(
      `DELETE FROM ${this.tableSchema}.${this.tableName} WHERE id=$1;`,
      [id.toString()]
    );
  }

  async add(entity: Entity): Promise<void> {
    let valuesMarkings = '';
    const valuesArray: string[] = [];
    const columnsInCommand: string[] = [];
    let iterator = 1;

    this.columns.forEach((columnName, index, array) => {
      const valueToInsert = (entity as any)[
        BaseRepositoryHelper.getRawColumnName(columnName)
      ];
      if (valueToInsert) {
        valuesMarkings += `$${iterator++}`;
        if (array.length != index + 1) {
          valuesMarkings += ', ';
        }
        valuesArray.push(BaseRepositoryHelper.objectToString(valueToInsert));
        columnsInCommand.push(columnName);
      }
    });

    const query = `INSERT INTO ${this.tableSchema}.${this.tableName}(${columnsInCommand}) VALUES (${valuesMarkings});`;
    await this.dbConnection.command(query, valuesArray);
  }

  async basicUpdate(entity: Entity): Promise<void> {
    let updateStatement = '';
    const valuesArray: string[] = [];
    let iterator = 1;

    this.columns.forEach((columnName, index, array) => {
      const valueToInsert = (entity as any)[
        BaseRepositoryHelper.getRawColumnName(columnName)
      ];
      if (valueToInsert) {
        updateStatement += `${columnName}=$${iterator++}`;
        if (array.length != index + 1) {
          updateStatement += ', ';
        }
        valuesArray.push(BaseRepositoryHelper.objectToString(valueToInsert));
      }
    });

    await this.dbConnection.command(
      `UPDATE ${this.tableSchema}.${this.tableName} SET ${updateStatement} WHERE id=$${iterator} and xmin=${entity.xmin};`,
      [...valuesArray, entity.id.toString()]
    );
  }
}