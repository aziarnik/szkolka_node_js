import { RequestHandler } from 'express';
import { JwTokenHelper } from '../helpers/jwtoken-helper';
import jwt from 'jsonwebtoken';
import { Consts } from '../consts';
import { asyncHandler } from './async-handler';

export const isAuth: RequestHandler = asyncHandler(async (req, res, next) => {
  try {
    const accessToken = JwTokenHelper.getJWToken(req);
    accessToken.checkExpiration();
    req.userContext = accessToken.getUserContext();
  } catch (err) {
    if (
      err instanceof jwt.JsonWebTokenError &&
      err.name === 'TokenExpiredError'
    ) {
      res.status(Consts.TOKEN_EXPIRED_RESPONSE_STATUS).json('Token expired');
    }

    res.status(400).json('Wrong token');
  }
  next();
});

export const isAuthWithoutExpirationChecking: RequestHandler = asyncHandler(
  async (req, res, next) => {
    try {
      const accessToken = JwTokenHelper.getJWToken(req);
      req.userContext = accessToken.getUserContext();
    } catch (err) {
      res.status(400).json('Wrong token');
    }
    next();
  }
);
