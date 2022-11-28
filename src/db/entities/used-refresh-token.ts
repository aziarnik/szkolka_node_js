import {
  IRefreshTokenBaseEntryData,
  RefreshTokenBase
} from './refresh-token-base';

export class UsedRefreshToken extends RefreshTokenBase {
  wasUsedAt: Date;

  constructor(entity: IUsedRefreshTokenEntryData) {
    super(entity);
    this.wasUsedAt = entity.wasUsedAt;
  }
}

export interface IUsedRefreshTokenEntryData extends IRefreshTokenBaseEntryData {
  wasUsedAt: Date;
}
