import { RequestHandler } from 'express';
import { DbInstance } from '../db/db-client';
import { DbConnection } from '../db/db-connection';

export const assignDbConnection: RequestHandler = async (req, res, next) => {
  req.dbConnection = new DbConnection(await DbInstance.getConnection());
  next();
  req.dbConnection.release();
};
