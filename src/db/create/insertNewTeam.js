const { pool } = require("./connection");

/**
 * @team An object which contains the team's
 * information
 *
 * Saves new team built in database
 * */
const insertNewTeam = (team) => {
  //console.log(JSON.stringify(event, null, 4))
  const query = `
      INSERT INTO 
        events(
          event_id, 
          server, 
          verticals, 
          members_per_team, 
          mentor_types
          )

        values(
          ${event.id}, 
          ${event.server},
          '${event.verticals}',
          '${event.membersPerTeam}',
          '${event.mentorsTypes}'
      )`;

  return new Promise((resolve, reject) => {
    pool.query(
      {
        sql: query,
        timeout: 40000, // 40s
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
