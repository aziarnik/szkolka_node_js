import { Router, Request, Response } from 'express';
import { StarlinkController } from '../controllers/starlink-controller';
import { IDbConnection } from '../db/interfaces/i-db-connection';
import { asyncHandler } from '../middlewares/async-handler';

export const starlinkRoute = Router();

const getStarlinkController = (
  dbConnection: IDbConnection
): StarlinkController => new StarlinkController(dbConnection as IDbConnection);

starlinkRoute.get(
  '/synchronize/:transactionId',
  asyncHandler((req: Request, res: Response) =>
    getStarlinkController(req.dbConnection as IDbConnection).synchronize(
      req,
      res
    )
  )
);

starlinkRoute.get(
  '/:id',
  asyncHandler((req: Request, res: Response) =>
    getStarlinkController(req.dbConnection as IDbConnection).getStarlink(
      req,
      res
    )
  )
);

starlinkRoute.delete(
  '/:id',
  asyncHandler((req: Request, res: Response) =>
    getStarlinkController(req.dbConnection as IDbConnection).softDeleteStarlink(
      req,
      res
    )
  )
);

starlinkRoute.post(
  '/',
  asyncHandler((req: Request, res: Response) =>
    getStarlinkController(req.dbConnection as IDbConnection).addNewStarlink(
      req,
      res
    )
  )
);

starlinkRoute.patch(
  '/:id',
  asyncHandler((req: Request, res: Response) =>
    getStarlinkController(req.dbConnection as IDbConnection).updateStarlink(
      req,
      res
    )
  )
);
