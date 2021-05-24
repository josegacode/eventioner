const { pool } = require("./connection");

/**
 * @param eventId Eventbrite event id
 * @returns Promise<boolean>
 *
 * Checks if the event
 * is active by using its
 * eventbrite id, no matters
 * which server is linked to
 * it.
 * */
const checkIfEventIsActive = (params) => {
  const query = `SELECT EXISTS
      (
        SELECT * 
        FROM events 
        WHERE event_id=${params.eventId}
      ) AS found`;

  return new Promise((resolve, reject) => {
    pool.query(
      {
        sql: query,
        timeout: process.env.DB_QUERY_TIMEOUT,
      },
      (error, results, fields) => {
        if (!error) resolve(results[0].found > 0 ? true : false);
        else reject(error);
      }
    );
  });
};

const checkIfThereAreActiveEvents = (serverId) => {
  const query = `SELECT EXISTS
      (
        SELECT * 
        FROM events 
        WHERE 
          server=${serverId}
      ) AS found`;

  return new Promise((resolve, reject) => {
    pool.query(
      {
        sql: query,
        timeout: 40000, // ms
      },
      (error, results, fields) => {
        if (!error) {
          console.log("ok");
          resolve(results[0].found > 0 ? true : false);
        } else {
          console.log(error);
          reject(error);
        }
      }
    );
  });
};

const checkIfServerExists = (serverId) => {
  // todo: avoid *
  const query = `SELECT EXISTS(SELECT * from servers WHERE guild_id=${serverId}) AS found`;

  return new Promise((resolve, reject) => {
    pool.query(
      {
        sql: query,
        timeout: 40000, // ms
      },
      (error, results, fields) => {
        if (!error) resolve(results[0].found > 0 ? true : false);
        else reject(false);
      }
    );
  });
};

const checkIfServerIsLinkedWithBot = (botId, serverId) => {
  // todo: avoid *
  //console.log(`server: ${serverId}, bot: ${botId}`);
  const query = `SELECT EXISTS(SELECT * FROM bots_servers WHERE bots_servers.bot_id=${botId} AND bots_servers.guild_id=${serverId}) AS found`;

  return new Promise((resolve, reject) => {
    pool.query(
      {
        sql: query,
        timeout: 40000, // 40s
      },
      (error, results, fields) => {
        if (!error) {
          console.log(
            `resolve checkIfServerIsLinkedWithBot(): ${results[0].found}`
          );
          resolve(results[0].found > 0 ? true : false);
        } else {
          console.log(`rejected checkIfServerIsLinkedWithBot()`);
          console.error(error);
          reject(false);
        }
      }
    );
  });
};
module.exports = {
  checkIfServerExists: checkIfServerExists,
  checkIfServerIsLinkedWithBot: checkIfServerIsLinkedWithBot,
  checkIfThereAreActiveEvents: checkIfThereAreActiveEvents,
  checkIfEventIsActive: checkIfEventIsActive,
};
