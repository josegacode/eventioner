const mysql = require("mysql2");

/*
const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_SERVICE_USER ,
  password : process.env.DB_SERVICE_USER_PASSWORD,
  database : process.env.DB_NAME 
});
*/

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_SERVICE_USER,
  password: process.env.DB_SERVICE_USER_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = {
  //connection: connection,
  pool: pool,
};
