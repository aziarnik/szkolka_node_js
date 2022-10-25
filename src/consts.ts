export class Consts {
  static readonly AUTHORIZATION_HEADER = 'Authorization';
  static readonly AUTHORIZATION_HEADER_BEGINNING = 'Bearer ';
  static readonly AUTHORIZATION_HEADER_BEGINNING_LENGTH = 7;
  static readonly ACCESS_TOKEN_EXPIRATION_IN_SECONDS = 60;
  static readonly REFRESH_TOKEN_EXPIRATION_IN_SECONDS = 600;
  static readonly TOKEN_EXPIRED_RESPONSE_STATUS = 410;
}
