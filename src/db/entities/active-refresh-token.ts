import {
  IRefreshTokenBaseEntryData,
  RefreshTokenBase
} from './refresh-token-base';

export class ActiveRefreshToken extends RefreshTokenBase {
  constructor(entity: IActiveRefreshTokenEntryData) {
    super(entity);
  }
}

export type IActiveRefreshTokenEntryData = IRefreshTokenBaseEntryData;
