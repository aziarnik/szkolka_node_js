import { RepositoriesStorage } from '../../../repositories/repositories-storage';
import { IEventBody } from './i-event-body';

export class UserDeletedEventBody implements IEventBody {
  userId: number;

  constructor(body: IUserDeletedEventBodyEntry) {
    this.userId = body.userId;
  }

  async process(reposStorage: RepositoriesStorage): Promise<void> {
    await reposStorage.refreshTokenRepository.hardDeleteAllForUser(this.userId);
  }
}

export interface IUserDeletedEventBodyEntry {
  userId: number;
}
