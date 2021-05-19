const { pool } = require('./connection');

const addNewServer = (serverId, serverName) => {
  const query = `INSERT INTO servers(guild_id, name) values(${serverId}, '${serverName}')`;

  return pool.query({
    sql: query,
    timeout: 40000, // 40s
    },
    (error, results, fields) => {
      // error will be an Error if one occurred during the query
      if(!error) {
        //console.log(JSON.stringify(results))
        if(results.affectedRows != 0)
          return true;
      } 
      else {
        //console.log(`error in query of addNewServer(): ${error}`);
        return false;
      }
    }
  );
}


const linkBotWithServer = (serverId, botId) => {
  const query = `INSERT INTO bots_servers(bot_id, guild_id) values(${serverId}, ${botId})`;

  return new Promise((resolve, reject) => {
    pool.query({
        sql: query,
        timeout: 40000, // 40s
        },
        (error, results, fields) => {
          // error will be an Error if one occurred during the query
          if(!error) 
            if(results.affectedRows != 0)
              resolve(true);
          else 
            console.log(`rejected linkBotWithServer(): ${error}`);
            reject(error);
        }
      );

  })
}
module.exports = {
  addNewServer: addNewServer,
  linkBotWithServer: linkBotWithServer,
}
