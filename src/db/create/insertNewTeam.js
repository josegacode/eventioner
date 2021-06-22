const { pool } = require("../connection");

/**
 * @params An object which contains the team's
 * information and server's event data
 *
 * Saves new team built in database
 * */
const insertNewTeam = async (event, roleName) => {
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
        timeout: process.env.DB_QUERY_TIMEOUT, // 40s
      },
      (error, results, fields) => {
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

module.exports = {
  insertNewTeam: insertNewTeam,
};
