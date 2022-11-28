import {
  IPostrgesBaseEntryData,
  PostgresBaseEntity
} from './postgres-base-entity';

export class UserRole extends PostgresBaseEntity {
  name: string;

  constructor(entity: IUserRoleEntryData) {
    super(entity);
    this.name = entity.name;
  }
}

export interface IUserRoleEntryData extends IPostrgesBaseEntryData {
  name: string;
}
