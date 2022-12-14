import config from 'config';

export class Configuration {
  static readonly PORT: number = config.get('port');

  static readonly POSTGRES_CONNECTION_STRING: string = config.get(
    'connectionStrings.postgreSql'
  );

  static readonly PASSWORD_PEPPER: string = config.get('passwordPepper');

  static readonly JWTOKEN_SECRET: string = config.get('jwTokenSecret');

  static readonly REFRESH_TOKEN_EXPIRATION_IN_SECONDS: number = config.get(
    'refreshTokenExpirationTimeInSeconds'
  );

  static readonly ACCESS_TOKEN_EXPIRATION_IN_SECONDS: number = config.get(
    'accessTokenExpirationTimeInSeconds'
  );
}
