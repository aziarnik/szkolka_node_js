import {
  IPostrgesBaseEntryData,
  PostgresBaseEntity
} from './postgres-base-entity';

export class Starlink extends PostgresBaseEntity {
  value: any;
  deleted_at: Date;

  constructor(entryData: IStarlinkEntryData) {
    super(entryData);
    this.value = entryData.value;
    this.deleted_at = entryData.deleted_at;
  }
}

export interface IStarlinkEntryData extends IPostrgesBaseEntryData {
  value: any;
  deleted_at: Date;
}
