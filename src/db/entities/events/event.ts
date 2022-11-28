import { errorMessages } from '../../../errors/error-messages';
import { RepositoriesStorage } from '../../repositories/repositories-storage';
import {
  IPostrgesBaseEntryData,
  PostgresBaseEntity
} from '../postgres-base-entity';
import { IEventBody } from './events-body/i-event-body';
import {
  IUserDeletedEventBodyEntry,
  UserDeletedEventBody
} from './events-body/user-deleted-event-body';
import {
  ISomeoneUsedOldRefreshToken,
  SomeoneUsedOldRefreshTokenEventBody
} from './events-body/someone-used-old-refresh-token-event-body';
import { CustomError } from '../../../errors/custom-error';

type AllowedEventNames = 'UserDeleted' | 'SomeoneUsedOldRefreshToken';

export class AppEvent extends PostgresBaseEntity {
  event_type: AllowedEventNames;
  event_body: IEventBody;

  constructor(event: IAppEventEntryData) {
    super(event);
    this.event_type = event.event_type;
    this.event_body = this.getEventBody(event.event_body);
  }

  async processEvent(reposStorage: RepositoriesStorage) {
    await this.event_body.process(reposStorage);
  }

  private getEventBody(eventBody: unknown) {
    switch (this.event_type) {
      case 'UserDeleted':
        return new UserDeletedEventBody(
          eventBody as IUserDeletedEventBodyEntry
        );
      case 'SomeoneUsedOldRefreshToken':
        return new SomeoneUsedOldRefreshTokenEventBody(
          eventBody as ISomeoneUsedOldRefreshToken
        );
      default:
        throw new CustomError(errorMessages.NO_EVENT_MAPPING_PROVIDED);
    }
  }
}

export interface IAppEventEntryData extends IPostrgesBaseEntryData {
  event_type: AllowedEventNames;
  event_body: IEventBody;
}

export interface IBasicAppEventData {
  event_type: AllowedEventNames;
  event_body: IEventBody;
}
