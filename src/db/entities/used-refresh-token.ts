import { RefreshTokenBase } from './refresh-token-base';

export class UsedRefreshToken extends RefreshTokenBase {
  wasUsedAt: Date;

  constructor(entity: UsedRefreshToken) {
    super(entity);
    this.wasUsedAt = entity.wasUsedAt;
  }
}
