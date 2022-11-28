import { UserRefreshTokens } from '../../aggregates/user-refresh-tokens';
import {
  ActiveRefreshToken,
  IActiveRefreshTokenEntryData
} from '../entities/active-refresh-token';
import {
  IUsedRefreshTokenEntryData,
  UsedRefreshToken
} from '../entities/used-refresh-token';
import { IDbConnection } from '../interfaces/i-db-connection';
import { BaseRepository } from './base-repository';

export class RefreshTokenRepository extends BaseRepository<
  ActiveRefreshToken,
  IActiveRefreshTokenEntryData
> {
  protected tableSchema = 'auth';
  protected tableName = 'activerefreshtokens';
  protected historicTableName = 'inactiverefreshtokens';
  protected columns: string[] = ['id', 'user_id', 'value'];
  protected entityType: new (
    entity: IActiveRefreshTokenEntryData
  ) => ActiveRefreshToken;

  constructor(conn: IDbConnection) {
    super(conn);
    this.entityType = ActiveRefreshToken;
  }

  async findForUserByValue(
    userId: number,
    value: string
  ): Promise<ActiveRefreshToken | null> {
    const results = await this.dbConnection.query(
      `SELECT ${this.columns} FROM ${this.tableSchema}.${this.tableName} WHERE user_id=$1 AND value=$2`,
      [userId.toString(), value]
    );

    return results[0]
      ? new ActiveRefreshToken(results[0] as IActiveRefreshTokenEntryData)
      : null;
  }

  async findAllByUserId(userId: number): Promise<ActiveRefreshToken[]> {
    return (
      await this.dbConnection.query(
        `SELECT ${this.columns} FROM ${this.tableSchema}.${this.tableName} WHERE user_id=$1`,
        [userId.toString()]
      )
    ).map((x) => new ActiveRefreshToken(x as IActiveRefreshTokenEntryData));
  }

  async findUserRefreshTokensByUserId(
    userId: number
  ): Promise<UserRefreshTokens> {
    const activeTokens = await this.findAllByUserId(userId);
    const usedTokens = (
      await this.dbConnection.query(
        `SELECT id, user_id, value, deleted_at FROM ${this.tableSchema}.${this.historicTableName} WHERE user_id=$1`,
        [userId.toString()]
      )
    ).map((x) => new UsedRefreshToken(x as IUsedRefreshTokenEntryData));

    return new UserRefreshTokens(userId, activeTokens, usedTokens);
  }

  async archive(id: number): Promise<void> {
    const deletedEntry = await this.firstOrDefaultById(id);
    await super.delete(id);
    this.dbConnection.command(
      `INSERT INTO ${this.tableSchema}.${this.historicTableName} (user_id, value, deleted_at) VALUES ($1, $2, $3)`,
      [
        deletedEntry.user_id.toString(),
        deletedEntry.value.toString(),
        new Date(Date.now()).toDateString()
      ]
    );
  }

  async hardDeleteAllForUser(userId: number): Promise<void> {
    await this.dbConnection.command(
      `DELETE FROM ${this.tableSchema}.${this.tableName} WHERE user_id=$1;`,
      [userId.toString()]
    );

    await this.dbConnection.command(
      `DELETE FROM ${this.tableSchema}.${this.historicTableName} WHERE user_id=$1;`,
      [userId.toString()]
    );
  }

  async deleteAllActiveTokensForUser(userId: number): Promise<void> {
    await this.dbConnection.command(
      `INSERT INTO ${this.tableSchema}.${this.historicTableName}
      (user_id, value, deleted_at) SELECT user_id, value, NOW() FROM 
      ${this.tableSchema}.${this.tableName} WHERE user_id=$1`,
      [userId.toString()]
    );

    await this.dbConnection.command(
      `DELETE FROM ${this.tableSchema}.${this.tableName} WHERE user_id=$1;`,
      [userId.toString()]
    );
  }
}
