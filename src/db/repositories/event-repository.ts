import {
  AppEvent,
  IAppEventEntryData,
  IBasicAppEventData
} from '../entities/events/event';
import { IDbConnection } from '../interfaces/i-db-connection';

export class EventRepository {
  private readonly dbConnection: IDbConnection;
  constructor(conn: IDbConnection) {
    this.dbConnection = conn;
  }

  async getEventsToProcess(): Promise<AppEvent[]> {
    return (
      await this.dbConnection.queryWithoutParams(
        `SELECT id, event_body, event_type FROM public.events WHERE completed_at is NULL`
      )
    ).map((x) => new AppEvent(x as IAppEventEntryData));
  }

  async completeEvent(eventId: number) {
    this.dbConnection.command(
      `UPDATE public.events SET completed_at=NOW() WHERE id=$1`,
      [eventId.toString()]
    );
  }

  async addNewEvent(event: IBasicAppEventData) {
    this.dbConnection.command(
      `INSERT INTO public.events(event_type, event_body) VALUES ($1, $2)`,
      [event.event_type, JSON.stringify(event.event_body)]
    );
  }
}
