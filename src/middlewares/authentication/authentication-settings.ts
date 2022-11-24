import { RequestHandler } from 'express';
import { Consts } from '../../consts';
import { RequestHandlerHelper } from '../../helpers/request-handler-helper';
import { AccessType } from './access-type';

export const authenticationSettings = (opt: AccessType): RequestHandler => {
  return (req, res, next) => {
    const userContext = req.userContext;
    const requestUserId = RequestHandlerHelper.getIdFromQueryParams(req);

    if (opt === AccessType.ForUser) {
      if (userContext.isUser()) {
        return next();
      }
      return res
        .status(Consts.PERMISSION_DENIED_STATUS)
        .json('Permission denied');
    }

    if (opt === AccessType.ForAdminAndOwnUserData) {
      if (
        userContext.isAdmin() ||
        (userContext.id && requestUserId && userContext.id === requestUserId)
      ) {
        return next();
      }
      return res
        .status(Consts.PERMISSION_DENIED_STATUS)
        .json('Permission denied');
    }

    if (opt === AccessType.OnlyForAdmin) {
      if (userContext.isAdmin()) {
        return next();
      }
      return res
        .status(Consts.PERMISSION_DENIED_STATUS)
        .json('Permission denied');
    }

    res.status(Consts.PERMISSION_DENIED_STATUS).json('Permission denied');
  };
};
