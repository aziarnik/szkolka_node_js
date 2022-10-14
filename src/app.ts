import bodyParser from 'body-parser';
import express from 'express';
import { versionRoute } from './routers/version-route';
import { DbInstance } from './db/db-client';
import { migrate } from './db/migrations/migrate';
import { DbConnection } from './db/db-connection';
import { seed } from './db/migrations/seed';
import config from 'config';
import { fakeRoute } from './routers/fake-crud-route';

const app = express();
const port = config.get('port');

app.use(async (req, res, next) => {
  req.dbConnection = new DbConnection(await DbInstance.getConnection());
  next();
});

app.use(bodyParser.json());
app.use(versionRoute);
app.use(fakeRoute);

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
