import { ActiveRefreshToken } from '../db/entities/active-refresh-token';
import { UsedRefreshToken } from '../db/entities/used-refresh-token';
import { RefreshToken } from '../value-objects/refresh-token';

export class UserRefreshTokens {
  userId: number;
  activeRefreshTokens: ActiveRefreshToken[];
  usedRefreshTokens: UsedRefreshToken[];

  constructor(
    userId: number,
    activeRefreshTokens: ActiveRefreshToken[],
    usedRefreshTokens: UsedRefreshToken[]
  ) {
    this.userId = userId;
    this.activeRefreshTokens = activeRefreshTokens;
    this.usedRefreshTokens = usedRefreshTokens;
  }

  wasRefreshTokenUsedBefore(refreshToken: RefreshToken): boolean {
    return this.usedRefreshTokens.some((token) =>
      token.value.equals(refreshToken)
    );
  }

  getActiveRefreshTokenByValue(refreshToken: RefreshToken): ActiveRefreshToken {
    return this.activeRefreshTokens.find((token) =>
      token.value.equals(refreshToken)
    ) as ActiveRefreshToken;
  }
}
