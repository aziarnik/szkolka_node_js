import { RepositoriesStorage } from '../../../repositories/repositories-storage';

export interface IEventBody {
  process: (repositoriesStorage: RepositoriesStorage) => Promise<void>;
}
