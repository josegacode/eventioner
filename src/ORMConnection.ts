import { createConnection } from "typeorm";

export const connection = await createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        __dirname + "/entity/*.js"
    ],
    synchronize: true,
}).then(connection => {
    // here you can start to work with your entities
		console.log('Connection status: ' + connection.isConnected);
}).catch(error => console.log(error));
