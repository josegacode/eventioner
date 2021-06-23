const { pool } = require("./connection");
/**
 * @param a server id linked to event that we want
 * to retrieve
 * @returns Promise<boolean>
 *
 * Checks if the event
 * is active by using its
 * eventbrite id, no matters
 * which server is linked to
 * it.
 * */
const getTeams = (eventId) => {
    const query = `
    SELECT * 
    FROM teams 
    WHERE event=${eventId}
  `;
    return new Promise((resolve, reject) => {
        pool.query({
            sql: query,
            timeout: process.env.DB_QUERY_TIMEOUT,
        }, (error, results, fields) => {
            if (!error) {
                // undefined if there is no records
                resolve(results);
            }
            else {
                console.log(`error in getTeams()`);
                reject(error);
            }
        });
    });
};
/**
 * TODO: replace by getEventActiveInfo
 * @param a server id linked to event that we want
 * to retrieve
 * @returns Promise<boolean>
 *
 * Checks if the event
 * is active by using its
 * eventbrite id, no matters
 * which server is linked to
 * it.
 * */
const getMembersPerTeam = (params) => {
    const query = `
        SELECT members_per_team 
        FROM events 
        WHERE 
          server=${params.serverId} AND
          is_active=true`;
    return new Promise((resolve, reject) => {
        pool.query({
            sql: query,
            timeout: process.env.DB_QUERY_TIMEOUT,
        }, (error, results, fields) => {
            if (!error) {
                //console.log(JSON.stringify(results, null, 4));
                resolve(results[0]);
            }
            else {
                console.log(`error in getMembersPerTeam()`);
                reject(error);
            }
        });
    });
};
/**
 * TODO: replace by getEventActiveInfo
 * @param a server id linked to event that we want
 * to retrieve
 * @returns Promise<boolean>
 *
 * Checks if the event
 * is active by using its
 * eventbrite id, no matters
 * which server is linked to
 * it.
 * */
const getVerticals = (params) => {
    const query = `
        SELECT verticals
        FROM events 
        WHERE 
          server=${params.serverId} AND
          is_active=true`;
    return new Promise((resolve, reject) => {
        pool.query({
            sql: query,
            timeout: process.env.DB_QUERY_TIMEOUT,
        }, (error, results, fields) => {
            if (!error) {
                //console.log(JSON.stringify(results, null, 4));
                resolve(results[0]);
            }
            else {
                console.log(`error in getEventActiveInfo()`);
                reject(error);
            }
        });
    });
};
/**
 * @param a server id linked to event that we want
 * to retrieve
 * @returns Promise<boolean>
 *
 * Checks if the event
 * is active by using its
 * eventbrite id, no matters
 * which server is linked to
 * it.
 * */
const getEventActiveInfo = async (serverId) => {
    const query = `
        SELECT 
          event_id, 
          verticals,
          members_per_team,
          mentor_types
        FROM events 
        WHERE server=${serverId} AND
        is_active=true`;
    let result = await pool.promise().query({
        sql: query,
        timeout: process.env.DB_QUERY_TIMEOUT,
    }, (error, results, fields) => {
        if (!error) {
            console.log(JSON.stringify(results[0], null, 4));
            return results[0];
        }
        else {
            console.log(`error in getEventActiveInfo()`);
            return error;
        }
    });
    return result;
};
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
        pool.query({
            sql: query,
            timeout: process.env.DB_QUERY_TIMEOUT,
        }, (error, results, fields) => {
            if (!error)
                resolve(results[0].found > 0 ? true : false);
            else {
                console.log(`error in checkIfEventIsActive()`);
                reject(error);
            }
        });
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
        pool.query({
            sql: query,
            timeout: 40000, // ms
        }, (error, results, fields) => {
            if (!error) {
                console.log("ok");
                resolve(results[0].found > 0 ? true : false);
            }
            else {
                console.log("error" + error);
                reject(error);
            }
        });
    });
};
const checkIfServerExists = (serverId) => {
    // todo: avoid *
    const query = `SELECT EXISTS(SELECT * from servers WHERE guild_id=${serverId}) AS found`;
    return new Promise((resolve, reject) => {
        pool.query({
            sql: query,
            timeout: 40000, // ms
        }, (error, results, fields) => {
            if (!error)
                resolve(results[0].found > 0 ? true : false);
            else
                reject(false);
        });
    });
};
const checkIfServerIsLinkedWithBot = (botId, serverId) => {
    // todo: avoid *
    //console.log(`server: ${serverId}, bot: ${botId}`);
    const query = `SELECT EXISTS(SELECT * FROM bots_servers WHERE bots_servers.bot_id=${botId} AND bots_servers.guild_id=${serverId}) AS found`;
    return new Promise((resolve, reject) => {
        pool.query({
            sql: query,
            timeout: 40000, // 40s
        }, (error, results, fields) => {
            if (!error) {
                console.log(`resolve checkIfServerIsLinkedWithBot(): ${results[0].found}`);
                resolve(results[0].found > 0 ? true : false);
            }
            else {
                console.log(`rejected checkIfServerIsLinkedWithBot()`);
                console.error(error);
                reject(false);
            }
        });
    });
};
module.exports = {
    checkIfServerExists: checkIfServerExists,
    checkIfServerIsLinkedWithBot: checkIfServerIsLinkedWithBot,
    checkIfThereAreActiveEvents: checkIfThereAreActiveEvents,
    checkIfEventIsActive: checkIfEventIsActive,
    getEventActiveInfo: getEventActiveInfo,
    getVerticals: getVerticals,
    getMembersPerTeam: getMembersPerTeam,
    getTeams: getTeams,
};
//# sourceMappingURL=read.js.map