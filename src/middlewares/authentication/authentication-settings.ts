import { RequestHandler } from 'express';
import { RequestHandlerHelper } from '../../helpers/request-handler-helper';
import { AccessType } from './access-type';

export const authenticationSettings = (opt: AccessType): RequestHandler => {
  return (req, res, next) => {
    const userContext = req.userContext;
    const requestUserId = RequestHandlerHelper.getIdFromQueryParams(req);
    switch (opt) {
      case AccessType.ForUser:
        if (userContext.isUser()) {
          return next();
        }
        break;
      case AccessType.ForAdminAndOwnUserData:
        if (
          userContext.isAdmin() ||
          (userContext.id && requestUserId && userContext.id === requestUserId)
        ) {
          return next();
        }
        break;
      case AccessType.OnlyForAdmin:
        if (userContext.isAdmin()) {
          return next();
        }
        break;
      default:
        break;
    }

    res.status(400).json('Permission denied');
  };
};
