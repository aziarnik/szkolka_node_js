import { RepositoriesStorage } from '../../../repositories/repositories-storage';
import { IEventBody } from './i-event-body';

export class SomeoneUsedOldRefreshTokenEventBody implements IEventBody {
  userId: number;

  constructor(body: ISomeoneUsedOldRefreshToken) {
    this.userId = body.userId;
  }

  async process(repositoriesStorage: RepositoriesStorage): Promise<void> {
    repositoriesStorage.refreshTokenRepository.deleteAllActiveTokensForUser(
      this.userId
    );
  }
}

export interface ISomeoneUsedOldRefreshToken {
  userId: number;
}
