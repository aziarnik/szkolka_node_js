import { AppEvent } from '../entities/events/event';
import { IDbConnection } from '../interfaces/i-db-connection';

export class EventRepository {
  private readonly dbConnection: IDbConnection;
  constructor(conn: IDbConnection) {
    this.dbConnection = conn;
  }

  async getEventsToProcess(): Promise<AppEvent[]> {
    return this.dbConnection.queryWithoutParams(
      `SELECT Id, event_body, event_type FROM public.events WHERE completed_at=NULL`
    );
  }

  async completeEvent(eventId: number) {
    this.dbConnection.command(
      `UPDATE public.events SET completed_at=NOW() WHERE id=$1`,
      [eventId.toString()]
    );
  }

  async addNewEvent(event: AppEvent) {
    this.dbConnection.command(
      `INSERT INTO public.events(event_type, event_body, deleted_on) VALUES ($1, $2, NULL)`,
      [event.event_type, JSON.stringify(event.event_body)]
    );
  }
}
