import { NextFunction, Request, Response } from 'express';
import { IDbConnection } from '../interfaces/i-db-connection';

export function runInTransaction() {
  return function (
    target: unknown,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      const dbConnection: IDbConnection = req.dbConnection as IDbConnection;
      try {
        dbConnection.beginTransation();
        await originalMethod?.call(this, req, res, next);
        dbConnection.commitTransaction();
      } catch (error) {
        dbConnection.rollbackTransation();
        throw error;
      }
    };

    return descriptor;
  };
}
