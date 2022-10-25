import { PostgresBaseEntity } from './postgres-base-entity';

export class UserRole extends PostgresBaseEntity {
  name: string;

  constructor(entity: UserRole) {
    super(entity);
    this.name = entity.name;
  }
}
