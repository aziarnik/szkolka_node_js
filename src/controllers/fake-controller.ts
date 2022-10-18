import { runInTransaction } from '../db/decorators/run-in-transaction';
import { Fake } from '../db/entities/fake';
import { Request, Response } from 'express';
import { IdInfo } from '../contracts/id-info';
import { DbConnection } from '../db/db-connection';
import { FakeRepository } from '../db/repositories/fake-repository';

export class FakeController {
  private readonly fakeRepository: FakeRepository;

  constructor(connection: DbConnection) {
    this.fakeRepository = new FakeRepository(connection);
  }

  @runInTransaction()
  async GetFakeObject(req: Request, res: Response<Fake>) {
    const result = await this.fakeRepository.firstOrDefaultById(
      parseInt(req.params['id'])
    );
    res.send(result);
  }

  @runInTransaction()
  async GetFakeObjects(req: Request, res: Response<Fake[]>) {
    const results = await this.fakeRepository.getAll();
    res.send(results);
  }

  @runInTransaction()
  async AddFakeObject(req: Request<unknown, unknown, Fake>, res: Response) {
    await this.fakeRepository.add(req.body.fake);
    res.send({ message: 'OK' });
  }

  @runInTransaction()
  async EditFakeObject(req: Request<unknown, unknown, Fake>, res: Response) {
    await this.fakeRepository.basicUpdate(req.body);
    res.send({ message: 'OK' });
  }

  @runInTransaction()
  async DeleteFakeObject(
    req: Request<unknown, unknown, IdInfo>,
    res: Response
  ) {
    await this.fakeRepository.delete(req.body.id);
    res.send({ message: 'OK' });
  }
}
