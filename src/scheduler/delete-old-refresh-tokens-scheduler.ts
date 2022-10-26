import schedule from 'node-schedule';
import { DbConnectionWrapper } from '../db/db-client';
import { IDbConnection } from '../db/interfaces/i-db-connection';
import { RepositoriesStorage } from '../db/repositories/repositories-storage';

export class DeleteOldRefreshTokensScheduler {
  static scheduleDeleteOldRefreshTokensJob = () => {
    const deleteOldRefreshTokensJob = schedule.scheduleJob(
      '* * * * *',
      async function () {
        DbConnectionWrapper.runTransactionInPostgres(
          async (dbConnection: IDbConnection) => {
            const reposStorage = new RepositoriesStorage(dbConnection);
            const refreshTokens =
              await reposStorage.refreshTokenRepository.getAll();
            refreshTokens.forEach(async (token) => {
              if (!token.value.validateExpirationDate()) {
                await reposStorage.refreshTokenRepository.archive(token.id);
              }
            });
          }
        );
      }
    );
  };
}
