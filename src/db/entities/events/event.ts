import { RepositoriesStorage } from '../../repositories/repositories-storage';
import { PostgresBaseEntity } from '../postgres-base-entity';
import { IEventBody } from './events-body/i-event-body';

type AllowedEventNames = 'UserDeleted' | 'UserLoggedOut';

export class AppEvent extends PostgresBaseEntity {
  event_type: AllowedEventNames;
  event_body: IEventBody;

  constructor(event: AppEvent) {
    super(event);
    this.event_type = event.event_type;
    this.event_body = event.event_body;
  }

  async processEvent(reposStorage: RepositoriesStorage) {
    await this.event_body.process(reposStorage);
  }
}
