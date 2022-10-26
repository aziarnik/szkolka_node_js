import { errorMessages } from '../../error-messages';
import { IUserEntryData, User } from '../entities/user';
import { IDbConnection } from '../interfaces/i-db-connection';
import { BaseRepository } from './base-repository';

export class UserRepository extends BaseRepository<User, IUserEntryData> {
  protected tableName = 'users';
  protected tableSchema = 'auth';
  protected columns: string[] = [
    'id',
    'user_name',
    'password',
    'deleted_on',
    'role'
  ];
  private isNotDeletedContraint = 'deleted_on is NULL';
  protected entityType: new (user: IUserEntryData) => User;

  constructor(conn: IDbConnection) {
    super(conn);
    this.entityType = User;
  }

  override async getAll(includeDeleted = false): Promise<User[]> {
    if (includeDeleted) {
      return super.getAll();
    }
    return (
      await this.dbConnection.queryWithoutParams(
        `SELECT ${this.columns}, ${this.systemColumns} FROM ${this.tableSchema}.${this.tableName} WHERE ${this.isNotDeletedContraint};`
      )
    ).map((x) => new User(x as IUserEntryData));
  }

  override async firstOrDefaultById(
    id: number,
    includeDeleted = false
  ): Promise<User> {
    if (includeDeleted) {
      return await super.firstOrDefaultById(id);
    }
    const result = await this.dbConnection.query(
      `SELECT ${this.columns}, ${this.systemColumns} FROM ${this.tableSchema}.${this.tableName} WHERE id=$1 AND ${this.isNotDeletedContraint}`,
      [id.toString()]
    );

    return new User(result[0] as IUserEntryData);
  }

  override async firstById(id: number, includeDeleted = false): Promise<User> {
    const result = await this.firstOrDefaultById(id, includeDeleted);

    if (!result) {
      throw new Error(errorMessages.DB_ENTRY_NOT_EXIST);
    }

    return result;
  }

  async findByEmail(email: string): Promise<User> {
    const result = await this.dbConnection.query(
      `SELECT ${this.columns}, ${this.systemColumns} FROM ${this.tableSchema}.${this.tableName} WHERE user_name=$1 AND ${this.isNotDeletedContraint}`,
      [email]
    );

    return new User(result[0] as IUserEntryData);
  }

  override async delete(id: number): Promise<void> {
    await this.dbConnection.command(
      `UPDATE ${this.tableSchema}.${this.tableName} SET deleted_on=$1 WHERE id=$2`,
      [new Date().toISOString(), id.toString()]
    );
  }
}
