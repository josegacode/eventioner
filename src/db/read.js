const { pool } = require('./connection');

const checkIfThereAreActiveEvents = serverId => {
  const query = 
    `SELECT EXISTS
      (
        SELECT * 
        FROM events 
        WHERE 
          server=${serverId} AND 
          is_active=true 
      ) AS found`;

  return new Promise((resolve, reject) => {
    pool.query({
        sql: query,
        timeout: 40000, // ms
        },
        (error, results, fields) => {
          if(!error) {
            console.log('ok')
            resolve(results[0].found > 0 ? true : false);
          } 
          else {
            console.log(error)
            reject(error);
          } 
        })
  })
}

const checkIfServerExists = serverId => {
  // todo: avoid *
  const query = `SELECT EXISTS(SELECT * from servers WHERE guild_id=${serverId}) AS found`;

  return new Promise((resolve, reject) => {
    pool.query({
        sql: query,
        timeout: 40000, // ms
        },
        (error, results, fields) => {
          if(!error) resolve(results[0].found > 0 ? true : false);
         else reject(false);
        })
  })
}

const checkIfServerIsLinkedWithBot = (botId, serverId) => {
  // todo: avoid *
  //console.log(`server: ${serverId}, bot: ${botId}`);
  const query = `SELECT EXISTS(SELECT * FROM bots_servers WHERE bots_servers.bot_id=${botId} AND bots_servers.guild_id=${serverId}) AS found`;

  return new Promise((resolve, reject) => {
    pool.query({
        sql: query,
        timeout: 40000, // 40s
        },
        (error, results, fields) => {
          if(!error) {
            console.log(`resolve checkIfServerIsLinkedWithBot(): ${results[0].found}`);
            resolve(results[0].found > 0 ? true : false);
          } 
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
  checkIfServerIsLinkedWithBot: checkIfServerIsLinkedWithBot,
  checkIfThereAreActiveEvents: checkIfThereAreActiveEvents 
}
