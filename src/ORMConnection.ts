import { Connection, createConnection } from "typeorm";
import * as entities from './entity/barrelOfEntities.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const connect = async (): Promise<Connection> => {
	try {
		return await createConnection({
				type: "mysql",
				host: "localhost",
				port: 3306,
				username: process.env.DB_USERNAME,
				password: process.env.DB_PASSWORD,
				database: process.env.DB_NAME,
				entities: [
					__dirname + "/entity/*.js",
				],
				migrations: ['/migration/*.js'],
			})
	} catch(error) {
		 console.error(error);
	}
}

