import { Request, Response } from 'express';
import { UserRepository } from '../db/repositories/user-repository';
import { IDbConnection } from '../db/interfaces/i-db-connection';
import { authLoginSchema } from '../joi-schemas/auth-schema';
import { LoginDto } from '../contracts/auth/login-dto';
import { runInTransaction } from '../db/decorators/run-in-transaction';
import { Consts } from '../consts';
import { RefreshTokenRepository } from '../db/repositories/refresh-token-repository';
import { UserTokenService } from '../services/user-token-service';
import { RefreshToken } from '../value-objects/refresh-token';

export class AuthController {
  private readonly userRepository: UserRepository;
  private readonly refreshTokenRepository: RefreshTokenRepository;
  private readonly userTokenService: UserTokenService;

  constructor(connection: IDbConnection) {
    this.userRepository = new UserRepository(connection);
    this.refreshTokenRepository = new RefreshTokenRepository(connection);
    this.userTokenService = new UserTokenService(
      this.userRepository,
      this.refreshTokenRepository
    );
  }

  @runInTransaction()
  async loginUser(req: Request<unknown, unknown, LoginDto>, res: Response) {
    await authLoginSchema.validateAsync(req.body);
    const user = await this.userRepository.findByEmail(req.body.userName);
    user.checkIfPasswordIsCorrect(req.body.password);
    const accessToken = await this.userTokenService.generateNewAccessToken(
      user.id,
      user.user_name,
      user.role
    );

    res.setHeader(
      Consts.AUTHORIZATION_HEADER,
      Consts.AUTHORIZATION_HEADER_BEGINNING + accessToken.value
    );

    res.status(200).json('User logged in');
  }

  @runInTransaction()
  async logoutUser(req: Request, res: Response) {
    const activeRefreshToken =
      await this.refreshTokenRepository.findForUserByValue(
        req.userContext.id,
        req.userContext.refreshToken.value
      );
    await this.refreshTokenRepository.archive(activeRefreshToken.id);
    res.removeHeader(Consts.AUTHORIZATION_HEADER);

    res.status(200).json('Logged out');
  }

  @runInTransaction()
  async getNewAccessToken(req: Request, res: Response) {
    const user = await this.userRepository.firstById(req.userContext.id);
    const userRefreshTokens =
      await this.refreshTokenRepository.findUserRefreshTokensByUserId(user.id);

    if (
      userRefreshTokens.wasRefreshTokenUsedBefore(req.userContext.refreshToken)
    ) {
      res.status(420).json('Something went wrong');
    }

    const activeTokenFromDb = userRefreshTokens.getActiveRefreshTokenByValue(
      req.userContext.refreshToken
    );
    if (activeTokenFromDb === null || activeTokenFromDb === undefined) {
      res.status(421).json('Refresh token not exist');
    }

    RefreshToken.create(activeTokenFromDb.value).validate();

    await this.refreshTokenRepository.archive(activeTokenFromDb.id);

    const accessToken = await this.userTokenService.generateNewAccessToken(
      req.userContext.id,
      req.userContext.email,
      req.userContext.role,
      req.userContext.refreshToken
    );

    res.setHeader(
      Consts.AUTHORIZATION_HEADER,
      Consts.AUTHORIZATION_HEADER_BEGINNING + accessToken.value
    );

    res.status(200).json('Token renewed');
  }
}
