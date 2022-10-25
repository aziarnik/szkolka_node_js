import { RepositoriesStorage } from '../../../repositories/repositories-storage';
import { IEventBody } from './i-event-body';

export class UserDeletedEventBody implements IEventBody {
  userId: number;

  constructor(userId: number) {
    this.userId = userId;
  }

  async process(reposStorage: RepositoriesStorage): Promise<void> {
    await reposStorage.refreshTokenRepository.hardDeleteAllForUser(this.userId);
  }
}
