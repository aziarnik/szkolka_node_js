import bodyParser from 'body-parser';
import express from 'express';
import { versionRoute } from './routers/version-route';
import { migrate } from './db/migrations/migrate';
import { seed } from './db/migrations/seed';
import { errorHandler } from './middlewares/error-request-handler';
import { assignDbConnection } from './middlewares/assign-db-connection';
import logger from './bunyan';
import { IDbConnection } from './db/interfaces/i-db-connection';
import { DbConnectionWrapper } from './db/db-client';
import { Configuration } from './configuration/configuration';
import { authRoute } from './routers/auth-route';
import { EventScheduler } from './scheduler/event-scheduler';
import { userRoute } from './routers/user-route';
import { isAuth } from './middlewares/is-auth';
import { DeleteOldRefreshTokensScheduler } from './scheduler/delete-old-refresh-tokens-scheduler';

const app = express();
const port = Configuration.PORT;

app.use(assignDbConnection);

app.use(bodyParser.json());
app.use(versionRoute);
app.use('/auth', authRoute);
app.use('/users', isAuth, userRoute);

app.use(errorHandler);

app.listen(port, async () => {
  try {
    logger.info(`Program is running on port: ${port}`);
    DbConnectionWrapper.runInPostgres(async (conn: IDbConnection) => {
      await seed(conn);
      await migrate(conn);
    });
    EventScheduler.scheduleEventProcess();
    DeleteOldRefreshTokensScheduler.scheduleDeleteOldRefreshTokensJob();
  } catch (exc) {
    logger.error(exc);
  }
});
