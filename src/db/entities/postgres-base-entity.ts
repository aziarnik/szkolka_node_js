export abstract class PostgresBaseEntity {
  xmin = 0;
  id = 0;

  constructor(entity: IPostrgesBaseEntryData) {
    this.xmin = entity.xmin;
    this.id = entity.id;
  }
}

export interface IPostrgesBaseEntryData {
  xmin: number;
  id: number;
}
