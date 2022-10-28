import { Fake } from '../entities/fake';
import { IDbConnection } from '../interfaces/i-db-connection';

export class FakeRepository {
  private readonly dbConnection: IDbConnection;
  private tableName = 'fake';
  private columns: string[] = ['id', 'fake'];

  constructor(conn: IDbConnection) {
    this.dbConnection = conn;
  }

  async firstOrDefaultById(id: number): Promise<Fake> {
    return (await this.dbConnection.firstOrDefaultById(
      id,
      this.tableName,
      this.columns
    )) as Promise<Fake>;
  }

  async firstById(id: number): Promise<Fake> {
    return (await this.dbConnection.firstById(
      id,
      this.tableName,
      this.columns
    )) as Promise<Fake>;
  }

  async getAll(): Promise<Fake[]> {
    return await this.dbConnection.queryWithoutParams(
      'SELECT id, fake FROM public.fake;'
    );
  }

  async add(fake: string): Promise<void> {
    await this.dbConnection.command(
      'INSERT INTO public.fake(fake) VALUES ($1);',
      [fake]
    );
  }

  async delete(id: number): Promise<void> {
    await this.dbConnection.command('DELETE FROM public.fake WHERE id=$1;', [
      id.toString()
    ]);
  }

  async basicUpdate(fake: Fake): Promise<void> {
    await this.dbConnection.command(
      'UPDATE public.fake SET fake=$1 WHERE id=$2;',
      [fake.fake, fake.id.toString()]
    );
  }
}