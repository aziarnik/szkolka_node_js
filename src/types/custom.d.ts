declare namespace Express {
  export interface Request {
    dbConnection?: import('../db/interfaces/i-db-connection').IDbConnection;
    userContext: import('../context/user-context').UserContext;
  }
}
