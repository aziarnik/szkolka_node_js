import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response
} from 'express';
import { logger } from '../bunyan';

export const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }
  logger.error(err);
  req.dbConnection?.release();
  res?.status(500)?.send(err);
};
