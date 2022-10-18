import type { ErrorRequestHandler } from 'express';
import { logger } from '../bunyan';

export const errorHandler: ErrorRequestHandler = (err, req, res) => {
  logger.error(err);
  req.dbConnection?.release();
  res?.status(500)?.send(err);
};
