import schedule from 'node-schedule';
import { DbConnectionWrapper } from '../db/db-client';
import { IDbConnection } from '../db/interfaces/i-db-connection';
import { RepositoriesStorage } from '../db/repositories/repositories-storage';

export class EventScheduler {
  static scheduleEventProcess = () => {
    const eventJob = schedule.scheduleJob('* * * * *', async function () {
      DbConnectionWrapper.runTransactionInPostgres(
        async (dbConnection: IDbConnection) => {
          const reposStorage = new RepositoriesStorage(dbConnection);
          const eventsToProcess =
            await reposStorage.eventRepository.getEventsToProcess();
          eventsToProcess.forEach(async (element) => {
            element.processEvent(reposStorage);
            await reposStorage.eventRepository.completeEvent(element.id);
          });
        }
      );
    });
  };
}
