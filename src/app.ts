import bodyParser from 'body-parser';
import express from 'express';
import { versionRoute } from './routers/version-route';
import { migrate } from './db/migrations/migrate';
import { seed } from './db/migrations/seed';
import config from 'config';
import { fakeRoute } from './routers/fake-crud-route';
import { errorHandler } from './middlewares/error-request-handler';
import { assignDbConnection } from './middlewares/assign-db-connection';
import { logger } from './bunyan';
import { DbConnectionFactory } from './db/db-client';

const app = express();
const port = config.get('port');

app.use(assignDbConnection);

app.use(bodyParser.json());
app.use(versionRoute);
app.use(fakeRoute);

app.use(errorHandler);

app.listen(port, async () => {
  try {
    logger.info(`Program is running on port: ${port}`);
    const postgreSqlConnection =
      await DbConnectionFactory.getPostgresConnection();
    await migrate(postgreSqlConnection);
    await seed(postgreSqlConnection);
    postgreSqlConnection.release();
  } catch (exc) {
    logger.error(exc);
  }
});
