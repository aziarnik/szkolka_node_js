import { IDbConnection } from '../db/interfaces/i-db-connection';
import { StarlinkRepository } from '../db/repositories/starlinks-repository';
import { Request, Response } from 'express';
import { RequestHandlerHelper } from '../helpers/request-handler-helper';
import { runInTransaction } from '../db/decorators/run-in-transaction';
import { GetStarlinkDto } from '../contracts/starlinks/get-starlink-dto';
import { Starlink } from '../db/entities/starlink';
import { applyPatch, Operation } from 'fast-json-patch';

export class StarlinkController {
  private readonly starlinkRepository: StarlinkRepository;

  constructor(connection: IDbConnection) {
    this.starlinkRepository = new StarlinkRepository(connection);
  }

  @runInTransaction()
  async getStarlink(req: Request, res: Response<GetStarlinkDto>) {
    const starlinkId = RequestHandlerHelper.getIdFromQueryParams(req);
    const result = await this.starlinkRepository.firstById(starlinkId);
    res.send(new GetStarlinkDto(result));
  }

  @runInTransaction()
  async softDeleteStarlink(req: Request, res: Response) {
    await this.starlinkRepository.softDelete(
      RequestHandlerHelper.getIdFromQueryParams(req)
    );
    res.send({ message: 'OK' });
  }

  @runInTransaction()
  async addNewStarlink(req: Request, res: Response) {
    const starlink = new Starlink({
      value: req.body
    } as Starlink);
    await this.starlinkRepository.add(starlink);

    res.status(200).json('Starlink registered');
  }

  @runInTransaction()
  async updateStarlink(req: Request<any, any, Operation[]>, res: Response) {
    const starlinkId = RequestHandlerHelper.getIdFromQueryParams(req);
    const starlink = await this.starlinkRepository.firstById(starlinkId);

    const updatedStarlink = new Starlink(
      applyPatch(starlink, req.body, undefined, false).newDocument
    );

    await this.starlinkRepository.basicUpdate(updatedStarlink);
    res.status(200).json('Starlink updated');
  }

  @runInTransaction()
  async synchronize(req: Request, res: Response<Starlink[]>) {
    const transactionId =
      RequestHandlerHelper.getTransactionIdFromQueryParams(req);

    const starlinksToSync = await this.starlinkRepository.getStarlinksNewerThan(
      transactionId
    );
    res.send(starlinksToSync);
  }
}
