import { PostgresBaseEntity } from './postgres-base-entity';

export class RefreshTokenBase extends PostgresBaseEntity {
  user_id: number;
  value: string;

  constructor(entity: RefreshTokenBase) {
    super(entity);
    this.user_id = entity.user_id;
    this.value = entity.value;
  }
}
