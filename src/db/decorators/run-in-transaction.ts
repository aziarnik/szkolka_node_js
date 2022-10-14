import { NextFunction, Request, Response } from 'express';
import { DbConnection } from '../db-connection';

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
      const dbConnection: DbConnection = req.dbConnection as DbConnection;
      try {
        dbConnection.beginTransation();
        await originalMethod?.call(this, req, res, next);
        dbConnection.commitTransaction();
      } catch (error) {
        dbConnection.rollbackTransation();
        throw error;
      } finally {
        dbConnection.release();
      }
    };

    return descriptor;
  };
}
