import { RefreshToken } from '../../value-objects/refresh-token';
import {
  IPostrgesBaseEntryData,
  PostgresBaseEntity
} from './postgres-base-entity';

export class RefreshTokenBase extends PostgresBaseEntity {
  user_id: number;
  value: RefreshToken;

  constructor(entity: IRefreshTokenBaseEntryData) {
    super(entity);
    this.user_id = entity.user_id;
    this.value = RefreshToken.create(entity.value);
  }
}

export interface IRefreshTokenBaseEntryData extends IPostrgesBaseEntryData {
  user_id: number;
  value: string;
}
