import { Request } from 'express';
import { Consts } from '../consts';
import jwt from 'jsonwebtoken';
import { Configuration } from '../configuration/configuration';
import { logger } from '../bunyan';

export class JwTokenHelper {
  static getJWToken = (req: Request): string => {
    const authorizationHeader = req.get(Consts.AUTHORIZATION_HEADER);
    if (
      authorizationHeader?.startsWith(Consts.AUTHORIZATION_HEADER_BEGINNING)
    ) {
      return authorizationHeader.substring(
        Consts.AUTHORIZATION_HEADER_BEGINNING_LENGTH
      );
    }
    return '';
  };

  static generateJWToken = (
    payload: object,
    expirationInSeconds: number
  ): string => {
    return jwt.sign(payload, Configuration.JWTOKEN_SECRET, {
      expiresIn: expirationInSeconds
    });
  };

  static generateJWTokenWithExpirationNounce = (
    payload: object,
    exp: number
  ): string => {
    return jwt.sign({ ...payload, exp: exp }, Configuration.JWTOKEN_SECRET);
  };

  static getTokenExpNounce = (token: string): number => {
    const decodedToken = jwt.decode(token, { json: true });
    return decodedToken?.exp as number;
  };

  static validateToken = (token: string): boolean => {
    try {
      jwt.verify(token, Configuration.JWTOKEN_SECRET);
    } catch (err) {
      logger.error(err);
      return false;
    }
    return true;
  };

  static validateTokenExpirationDate = (token: string): boolean => {
    try {
      jwt.verify(token, Configuration.JWTOKEN_SECRET);
    } catch (err) {
      if (
        err instanceof jwt.JsonWebTokenError &&
        err.name === 'TokenExpiredError'
      )
        return false;
    }

    return true;
  };
}
