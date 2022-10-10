declare namespace Express {
  export interface Request {
    dbConnection?: import('../db/db-connection').DbConnection;
  }
}
