const { pool } = require('./connection');

const checkIfServerExists = serverId => {
  // todo: avoid *
  const query = `SELECT EXISTS(SELECT * from servers WHERE guild_id=${serverId}) AS found`;

  return new Promise((resolve, reject) => {
    pool.query({
        sql: query,
        timeout: 40000, // 40s
        },
        (error, results, fields) => {
          // error will be an Error if one occurred during the query
          if(!error) {
            //console.log(`encontrado: ${results[0].found}`);
            resolve(results[0].found > 0 ? true : false);
          } else {
            //console.log(`error in query of checkIfServerExists(): ${error}`);
            reject(false);
          }
          // fields will contain information about the returned results fields (if any)
        })
  })
}

const checkIfServerIsLinkedWithBot = (serverId, botId) => {
  // todo: avoid *
  console.log(`server: ${serverId}, bot: ${botId}`);
  const query = `SELECT EXISTS(SELECT * FROM bots_servers WHERE bots_servers.bot_id=${botId} AND bots_servers.guild_id=${serverId}) AS found`;

  return new Promise((resolve, reject) => {
    pool.query({
        sql: query,
        timeout: 40000, // 40s
        },
        (error, results, fields) => {
          if(!error) resolve(results[0].found > 0 ? true : false);
          else {
            console.log(`rejected checkIfServerIsLinkedWithBot()`);
            console.error(error);
            reject(false);
          } 
        }
    )
  })
}
module.exports = {
  checkIfServerExists: checkIfServerExists,
  checkIfServerIsLinkedWithBot: checkIfServerIsLinkedWithBot
}
