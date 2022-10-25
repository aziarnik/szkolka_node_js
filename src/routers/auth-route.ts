import { Router, Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/auth-controller';
import { IDbConnection } from '../db/interfaces/i-db-connection';
import { asyncHandler } from '../middlewares/async-handler';
import {
  isAuth,
  isAuthWithoutExpirationChecking
} from '../middlewares/is-auth';

export const authRoute = Router();

const getAuthController = (dbConnection: IDbConnection): AuthController =>
  new AuthController(dbConnection as IDbConnection);

authRoute.post(
  '/login',
  asyncHandler((req: Request, res: Response) =>
    getAuthController(req.dbConnection as IDbConnection).loginUser(req, res)
  )
);

authRoute.post(
  '/logout',
  isAuth,
  asyncHandler((req: Request, res: Response) =>
    getAuthController(req.dbConnection as IDbConnection).logoutUser(req, res)
  )
);

authRoute.post(
  '/new-access-token',
  isAuthWithoutExpirationChecking,
  asyncHandler((req: Request, res: Response) =>
    getAuthController(req.dbConnection as IDbConnection).getNewAccessToken(
      req,
      res
    )
  )
);
