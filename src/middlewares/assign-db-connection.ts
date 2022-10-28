import { RequestHandler } from 'express';
import onFinished from 'on-finished';
import { DbConnectionFactory } from '../db/db-client';

export const assignDbConnection: RequestHandler = async (req, res, next) => {
  req.dbConnection = await DbConnectionFactory.getPostgresConnection();
  onFinished(req, function (err, req) {
    req.dbConnection?.release();
  });
  next();
};
