import { IDbConnection } from '../interfaces/i-db-connection';
import { EventRepository } from './event-repository';
import { RefreshTokenRepository } from './refresh-token-repository';
import { UserRepository } from './user-repository';

export class RepositoriesStorage {
  eventRepository: EventRepository;
  userRepository: UserRepository;
  refreshTokenRepository: RefreshTokenRepository;

  constructor(conn: IDbConnection) {
    this.eventRepository = new EventRepository(conn);
    this.userRepository = new UserRepository(conn);
    this.refreshTokenRepository = new RefreshTokenRepository(conn);
  }
}
