import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response
} from 'express';
import { logger } from '../bunyan';
import { Consts } from '../consts';
import { CustomError } from '../errors/custom-error';

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
  if (err instanceof CustomError) {
    res.status(Consts.CUSTOM_ERROR_STATUS).json(err.message);
  }
  res.status(500)?.json(err);
};
