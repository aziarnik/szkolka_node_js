import { RepositoriesStorage } from '../../../repositories/repositories-storage';
import { IEventBody } from './i-event-body';

export class UserLoggedOutEventBody implements IEventBody {
  userId: number;

  constructor(userId: number) {
    this.userId = userId;
  }

  async process(repositoriesStorage: RepositoriesStorage): Promise<void> {
    repositoriesStorage.refreshTokenRepository.deleteAllActiveTokensForUser(
      this.userId
    );
  }
}
