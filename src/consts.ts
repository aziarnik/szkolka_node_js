export class Consts {
  static readonly AUTHORIZATION_HEADER = 'Authorization';
  static readonly AUTHORIZATION_HEADER_BEGINNING = 'Bearer ';
  static readonly AUTHORIZATION_HEADER_BEGINNING_LENGTH = 7;
  static readonly TOKEN_EXPIRED_RESPONSE_STATUS = 410;
  static readonly REFRESH_TOKEN_EXPIRED = 422;
  static readonly CUSTOM_ERROR_STATUS = 430;
  static readonly PERMISSION_DENIED_STATUS = 431;
  static readonly REFRESH_TOKEN_USED_OR_DELETED_BY_JOB = 205;
  static readonly TRANSACTION_ID_HEADER_NAME = 'TransactionId';
}
