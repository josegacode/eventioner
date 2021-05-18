const { connection } = require('./connection');

const checkIfServerExists = serverId => {
  // todo: avoid *
  const query = `SELECT EXISTS(SELECT * from servers WHERE guild_id=${serverId}) AS found`;

  return connection.query({
    sql: query,
    timeout: 40000, // 40s
    },
    (error, results, fields) => {
      // error will be an Error if one occurred during the query
      if(!error) {
        return results[0].found > 0 ? true : false;
      } else {
        console.log(`error in query of checkIfServerExists(): ${error}`);
      }
      // fields will contain information about the returned results fields (if any)
    })
}

module.exports = {
  checkIfServerExists: checkIfServerExists
}
