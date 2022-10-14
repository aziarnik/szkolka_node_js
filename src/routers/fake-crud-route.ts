import { Request, Response, Router } from 'express';
import { IdInfo } from '../contracts/id-info';
import { FakeController } from '../controllers/fake-controller';
import { DbConnection } from '../db/db-connection';
import { Fake } from '../db/entities/fake';
import { asyncHandler } from '../middlewares/async-handler';

export const fakeRoute = Router();

const getFakeController = (dbConnection: DbConnection): FakeController =>
  new FakeController(dbConnection as DbConnection);

fakeRoute.get(
  '/fake/:id',
  asyncHandler((req: Request, res: Response<Fake>) =>
    getFakeController(req.dbConnection as DbConnection).GetFakeObject(req, res)
  )
);

fakeRoute.get(
  '/fakeAll',
  asyncHandler((req, res) =>
    getFakeController(req.dbConnection as DbConnection).GetFakeObjects(req, res)
  )
);

fakeRoute.post(
  '/add-fake',
  asyncHandler((req: Request<unknown, unknown, Fake>, res: Response) =>
    getFakeController(req.dbConnection as DbConnection).AddFakeObject(req, res)
  )
);

fakeRoute.post(
  '/edit-fake',
  asyncHandler((req: Request<unknown, unknown, Fake>, res: Response) =>
    getFakeController(req.dbConnection as DbConnection).EditFakeObject(req, res)
  )
);

fakeRoute.delete(
  '/fake',
  asyncHandler((req: Request<unknown, unknown, IdInfo>, res: Response) =>
    getFakeController(req.dbConnection as DbConnection).DeleteFakeObject(
      req,
      res
    )
  )
);
