const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_SERVICE_USER ,
  password : process.env.DB_SERVICE_USER_PASSWORD,
  database : process.env.DB_NAME 
});

const powerOn = () => {
  connection.connect((error) => {
    if(error) {
      console.log('error setting connection to db');
      return false;
    } else {
      console.log(`Connected to ${process.env.DB_NAME}!, thread id: ${connection.threadId}`);
      return true;
    } 
  })
}
/*

*/

module.exports = { 
  connection: connection,
  powerOn: powerOn
}
