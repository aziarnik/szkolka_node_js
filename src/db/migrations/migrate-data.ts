import { StarlinkHttpClient } from '../../external-connections/starlink-connection';
import { IDbConnection } from '../interfaces/i-db-connection';
import { StarlinkRepository } from '../repositories/starlinks-repository';

export const migrateData = async function (connection: IDbConnection) {
  const starlinkRepository = new StarlinkRepository(connection);

  if (!(await starlinkRepository.isAny())) {
    const starlinkData = await StarlinkHttpClient.getStarlinks();
    await starlinkRepository.multipleInserts(starlinkData);
  }
};
