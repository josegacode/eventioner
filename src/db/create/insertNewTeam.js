const { pool } = require("../connection");

/**
 * @params An object which contains the team's
 * information and server's event data
 *
 * Saves new team built in database
 * */
const insertNewTeam = (params) => {
  //console.log(JSON.stringify(event, null, 4))
  const query = `
      INSERT INTO 
        teams(
          name,
          event
          )

        values(
          '${params.team.role.name}', 
          ${params.event.event_id}
      )`;

  return new Promise((resolve, reject) => {
    pool.query(
      {
        sql: query,
        timeout: process.env.DB_QUERY_TIMEOUT, // 40s
      },
      (error, results, fields) => {
        if (!error) {
          if (results.affectedRows != 0) resolve(true);
          else resolve(false);
        } else return reject(error);
      }
    );
  });
};

module.exports = {
  insertNewTeam: insertNewTeam
}; 
