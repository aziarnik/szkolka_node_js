import { RequestHandler } from 'express';
import onFinished from 'on-finished';
import { DbInstance } from '../db/db-client';
import { DbConnection } from '../db/db-connection';

export const assignDbConnection: RequestHandler = async (req, res, next) => {
  req.dbConnection = new DbConnection(await DbInstance.getConnection());
  onFinished(req, function (err, req) {
    req.dbConnection?.release();
  });
  next();
};
