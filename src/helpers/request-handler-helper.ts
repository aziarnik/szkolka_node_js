import { Request } from 'express';
import { Consts } from '../consts';

export class RequestHandlerHelper {
  static getIdFromQueryParams(req: Request): number {
    return parseInt(req.params.id as string);
  }

  static getTransactionIdFromRequestHeader(req: Request): number {
    const value = req.get(Consts.TRANSACTION_ID_HEADER_NAME) as string;
    return parseInt(value);
  }
}
