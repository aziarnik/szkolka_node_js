import { RequestHandler } from 'express';
import { JwTokenHelper } from '../helpers/jwtoken-helper';
import jwt from 'jsonwebtoken';
import { UserContext } from '../context/user-context';
import { Configuration } from '../configuration/configuration';
import { Consts } from '../consts';
import { asyncHandler } from './async-handler';

export const isAuth: RequestHandler = asyncHandler(async (req, res, next) => {
  const jwToken = JwTokenHelper.getJWToken(req);
  try {
    const userContext: unknown = jwt.verify(
      jwToken,
      Configuration.JWTOKEN_SECRET
    );
    req.userContext = new UserContext(userContext);
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
    const jwToken = JwTokenHelper.getJWToken(req);
    const userContext: unknown = jwt.verify(
      jwToken,
      Configuration.JWTOKEN_SECRET,
      { ignoreExpiration: true }
    );
    req.userContext = new UserContext(userContext);

    next();
  }
);
