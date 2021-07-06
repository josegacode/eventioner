import { pool } from "../connection.js";

/**
 * @params An object which contains the team's
 * information and server's event data
 *
 * Saves new team built in database
 * */
export const insertNewTeam = async (event, roleName) => {
  //console.log(JSON.stringify(event, null, 4))
  const query = `
      INSERT INTO 
        teams(
          name,
          event
          )

        values(
          '${roleName}', 
          ${event}
      )`;

    pool.query(
      {
        sql: query,
        timeout: parseInt(process.env.DB_QUERY_TIMEOUT), // 40s
      },
      (error, results: String, fields) => {
        if (!error) {
          if (results.affectedRows != 0) 
            return true;
          else 
            return false;
        } else 
          return error;
      }
    );
};
