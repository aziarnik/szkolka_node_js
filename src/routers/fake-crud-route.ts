import { Request, Response, Router } from 'express';
import { IdInfo } from '../contracts/id-info';
import { FakeController } from '../controllers/fake-controller';
import { Fake } from '../db/entities/fake';
import { IDbConnection } from '../db/interfaces/i-db-connection';
import { asyncHandler } from '../middlewares/async-handler';

export const fakeRoute = Router();

const getFakeController = (dbConnection: IDbConnection): FakeController =>
  new FakeController(dbConnection as IDbConnection);

fakeRoute.get(
  '/fake/:id',
  asyncHandler((req: Request, res: Response<Fake>) =>
    getFakeController(req.dbConnection as IDbConnection).GetFakeObject(req, res)
  )
);

fakeRoute.get(
  '/fakeAll',
  asyncHandler((req, res) =>
    getFakeController(req.dbConnection as IDbConnection).GetFakeObjects(
      req,
      res
    )
  )
);

fakeRoute.post(
  '/add-fake',
  asyncHandler((req: Request<unknown, unknown, Fake>, res: Response) =>
    getFakeController(req.dbConnection as IDbConnection).AddFakeObject(req, res)
  )
);

fakeRoute.post(
  '/edit-fake',
  asyncHandler((req: Request<unknown, unknown, Fake>, res: Response) =>
    getFakeController(req.dbConnection as IDbConnection).EditFakeObject(
      req,
      res
    )
  )
);

fakeRoute.delete(
  '/fake',
  asyncHandler((req: Request<unknown, unknown, IdInfo>, res: Response) =>
    getFakeController(req.dbConnection as IDbConnection).DeleteFakeObject(
      req,
      res
    )
  )
);
