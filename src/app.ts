import bodyParser from 'body-parser';
import express from 'express';
import { versionRoute } from './routers/version-route';
import { DbInstance } from './db/db-client';
import { migrate } from './db/migrations/migrate';
import { seed } from './db/migrations/seed';
import config from 'config';
import { fakeRoute } from './routers/fake-crud-route';
import { errorHandler } from './middlewares/error-request-handler';
import { assignDbConnection } from './middlewares/assign-db-connection';

const app = express();
const port = config.get('port');

app.use(assignDbConnection);

app.use(bodyParser.json());
app.use(versionRoute);
app.use(fakeRoute);

app.use(errorHandler);

app.listen(port, async () => {
  try {
    console.log(`Program is running on port: ${port}`);
    DbInstance.getInstance();
    await migrate();
    await seed();
  } catch (exc) {
    console.log(exc);
  }
});
