import { UserContext } from '../context/user-context';
import { ActiveRefreshToken } from '../db/entities/active-refresh-token';
import { IRefreshTokenBaseEntryData } from '../db/entities/refresh-token-base';
import { RefreshTokenRepository } from '../db/repositories/refresh-token-repository';
import { UserRepository } from '../db/repositories/user-repository';
import { Role } from '../enums/user-role';
import { AccessToken } from '../value-objects/access-token';
import { RefreshToken } from '../value-objects/refresh-token';

export class UserTokenService {
  private readonly userRepository: UserRepository;
  private readonly refreshTokenRepository: RefreshTokenRepository;
  constructor(
    userRepository: UserRepository,
    refreshTokenRepository: RefreshTokenRepository
  ) {
    this.refreshTokenRepository = refreshTokenRepository;
    this.userRepository = userRepository;
  }

  async generateNewAccessToken(
    userId: number,
    userEmail: string,
    userRole: Role,
    oldRefreshToken: RefreshToken | null = null
  ): Promise<AccessToken> {
    const refreshToken = oldRefreshToken
      ? RefreshToken.generateWithExpNounceFrom(oldRefreshToken)
      : RefreshToken.generate();
    await this.refreshTokenRepository.add(
      new ActiveRefreshToken({
        user_id: userId,
        value: refreshToken.value
      } as IRefreshTokenBaseEntryData)
    );

    const userContext = new UserContext({
      id: userId,
      email: userEmail,
      refreshToken: refreshToken.value,
      role: userRole
    });

    return AccessToken.generate(userContext);
  }
}
