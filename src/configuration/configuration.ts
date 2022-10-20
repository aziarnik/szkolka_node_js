import config from 'config';

export class Configuration {
  static readonly PORT: number = config.get('port');

  static readonly POSTGRES_CONNECTION_STRING: string = config.get(
    'connectionStrings.postgreSql'
  );
}
