import bodyParser from 'body-parser';
import express from 'express';
import { versionRoute } from './routers/version-route';
import { DbInstance } from './db/db-client';
import { migrate } from './db/migrations/migrate';
import { DbConnection } from './db/db-connection';
import { seed } from './db/migrations/seed';

const app = express();

app.use(bodyParser.json());
app.use(async (req, res, next) => {
  req.dbConnection = new DbConnection(await DbInstance.getConnection());
  next();
});
app.get('/', (req, res) => {
  res.send({ message: 'Hello world' });
});
app.use(versionRoute);

app.listen(4000, 'localhost', async () => {
  DbInstance.getInstance();
  await migrate();
  await seed();
});
