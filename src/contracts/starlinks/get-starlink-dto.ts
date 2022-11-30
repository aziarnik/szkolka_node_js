import { Starlink } from '../../db/entities/starlink';

export class GetStarlinkDto {
  id: number;
  value: any;
  xmin: number;
  deleted_at: Date;

  constructor(starlink: Starlink) {
    this.id = starlink.id;
    this.value = starlink.value;
    this.xmin = starlink.xmin;
    this.deleted_at = starlink.deleted_at;
  }
}
