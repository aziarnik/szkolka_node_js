import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err);
  req.dbConnection?.release();
  res.status(500).send(err);
};
