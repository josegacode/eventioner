const { connection } = require('./connection');

const addNewServer = (serverId, serverName) => {
  const query = `INSERT INTO servers(guild_id, name) values(${serverId}, '${serverName}')`;

  connection.query({
    sql: query,
    timeout: 40000, // 40s
    },
    (error, results, fields) => {
      // error will be an Error if one occurred during the query
      if(!error) {
        console.log(JSON.stringify(results))
        if(results.affectedRows != 0)
          return true;
      } 
      else {
        console.log(`error in query of addNewServer(): ${error}`);
        return false;
      }
    }
  );
}

module.exports = {
  addNewServer: addNewServer 
}
