export abstract class PostgresBaseEntity {
  xmin = 0;
  id = 0;

  constructor(entity: PostgresBaseEntity) {
    this.xmin = entity.xmin;
    this.id = entity.id;
  }
}
