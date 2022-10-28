import { Request, Response } from 'express';
import { UserRepository } from '../db/repositories/user-repository';
import { IDbConnection } from '../db/interfaces/i-db-connection';
import { authLoginSchema } from '../joi-schemas/auth-schema';
import { LoginDto } from '../contracts/auth/login-dto';
import { runInTransaction } from '../db/decorators/run-in-transaction';
import { Consts } from '../consts';
import { RefreshTokenRepository } from '../db/repositories/refresh-token-repository';
import { UserTokenService } from '../services/user-token-service';
import { EventRepository } from '../db/repositories/event-repository';
import { SomeoneUsedOldRefreshTokenEventBody } from '../db/entities/events/events-body/someone-used-old-refresh-token-event-body';

export class AuthController {
  private readonly userRepository: UserRepository;
  private readonly refreshTokenRepository: RefreshTokenRepository;
  private readonly userTokenService: UserTokenService;
  private readonly eventRepository: EventRepository;

  constructor(connection: IDbConnection) {
    this.userRepository = new UserRepository(connection);
    this.refreshTokenRepository = new RefreshTokenRepository(connection);
    this.eventRepository = new EventRepository(connection);
    this.userTokenService = new UserTokenService(
      this.userRepository,
      this.refreshTokenRepository
    );
  }

  @runInTransaction()
  async loginUser(req: Request<unknown, unknown, LoginDto>, res: Response) {
    await authLoginSchema.validateAsync(req.body);
    const user = await this.userRepository.findByEmail(req.body.userName);
    await user.checkIfPasswordIsCorrect(req.body.password);
    const accessToken = await this.userTokenService.generateNewAccessToken(
      user.id,
      user.user_name,
      user.role
    );

    res
      .setHeader(
        Consts.AUTHORIZATION_HEADER,
        Consts.AUTHORIZATION_HEADER_BEGINNING + accessToken.value
      )
      .status(200)
      .json('User logged in');
  }

  @runInTransaction()
  async logoutUser(req: Request, res: Response) {
    const activeRefreshToken =
      await this.refreshTokenRepository.findForUserByValue(
        req.userContext.id,
        req.userContext.refreshToken.value
      );
    if (activeRefreshToken) {
      await this.refreshTokenRepository.archive(activeRefreshToken.id);
    }
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
      await this.eventRepository.addNewEvent({
        event_type: 'SomeoneUsedOldRefreshToken',
        event_body: new SomeoneUsedOldRefreshTokenEventBody({
          userId: req.userContext.id
        })
      });
      return res.status(205).json('Something went wrong');
    }

    const activeTokenFromDb = userRefreshTokens.getActiveRefreshTokenByValue(
      req.userContext.refreshToken
    );
    if (activeTokenFromDb === null || activeTokenFromDb === undefined) {
      res.status(421).json('Refresh token not exist');
    }

    if (!activeTokenFromDb.value.validate()) {
      res.status(Consts.REFRESH_TOKEN_EXPIRED).json('Refresh token expired');
    }

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
