import mysql from "mysql2";

/*
const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_SERVICE_USER ,
  password : process.env.DB_SERVICE_USER_PASSWORD,
  database : process.env.DB_NAME 
});
*/

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
