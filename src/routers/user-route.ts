import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/user-controller';
import { IDbConnection } from '../db/interfaces/i-db-connection';
import { asyncHandler } from '../middlewares/async-handler';
import { AccessType } from '../middlewares/authentication/access-type';
import { authenticationSettings } from '../middlewares/authentication/authentication-settings';

export const userRoute = Router();

const getUserController = (dbConnection: IDbConnection): UserController =>
  new UserController(dbConnection as IDbConnection);

userRoute.get(
  '/',
  asyncHandler((req: Request, res: Response) =>
    getUserController(req.dbConnection as IDbConnection).getAllUsers(req, res)
  )
);

userRoute.delete(
  '/:id',
  authenticationSettings(AccessType.ForAdminAndOwnUserData),
  asyncHandler((req: Request, res: Response) =>
    getUserController(req.dbConnection as IDbConnection).softDeleteUser(
      req,
      res
    )
  )
);

userRoute.post(
  '/',
  authenticationSettings(AccessType.OnlyForAdmin),
  asyncHandler((req: Request, res: Response) =>
    getUserController(req.dbConnection as IDbConnection).registerUser(req, res)
  )
);

userRoute.patch(
  '/:id',
  authenticationSettings(AccessType.ForAdminAndOwnUserData),
  asyncHandler((req: Request, res: Response) =>
    getUserController(req.dbConnection as IDbConnection).updateUser(req, res)
  )
);
