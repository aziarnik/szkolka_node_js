import { Request } from 'express';

export class RequestHandlerHelper {
  static getIdFromQueryParams(req: Request): number {
    return parseInt(req.params.id as string);
  }
}
