const { pool } = require("./connection");
const linkEventWithServer = (event) => {
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
        pool.query({
            sql: query,
            timeout: 40000, // 40s
        }, (error, results, fields) => {
            if (!error) {
                if (results.affectedRows != 0)
                    resolve(true);
                else
                    resolve(false);
            }
            else
                return reject(error);
        });
    });
};
const addNewServer = (serverId, serverName) => {
    const query = `INSERT INTO servers(guild_id, name) values(${serverId}, '${serverName}')`;
    return pool.query({
        sql: query,
        timeout: 40000, // 40s
    }, (error, results, fields) => {
        // error will be an Error if one occurred during the query
        if (!error) {
            //console.log(JSON.stringify(results))
            if (results.affectedRows != 0)
                return true;
        }
        else {
            //console.log(`error in query of addNewServer(): ${error}`);
            return false;
        }
    });
};
const linkBotWithServer = (serverId, botId) => {
    const query = `INSERT INTO bots_servers(bot_id, guild_id) values(${serverId}, ${botId})`;
    return new Promise((resolve, reject) => {
        pool.query({
            sql: query,
            timeout: 40000, // 40s
        }, (error, results, fields) => {
            // error will be an Error if one occurred during the query
            if (!error)
                if (results.affectedRows != 0)
                    resolve(true);
                else
                    console.log(`rejected linkBotWithServer(): ${error}`);
            reject(error);
        });
    });
};
module.exports = {
    addNewServer: addNewServer,
    linkBotWithServer: linkBotWithServer,
    linkEventWithServer: linkEventWithServer,
};
//# sourceMappingURL=create.js.map