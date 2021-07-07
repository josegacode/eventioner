import { Connection, createConnection } from "typeorm";
import { Event } from './entity/Event';
import { Team } from './entity/Team';

const connect = async (): Promise<Connection> => {
	try {
		return await createConnection({
				type: "mysql",
				host: "localhost",
				port: 3306,
				username: process.env.DB_USERNAME,
				password: process.env.DB_PASSWORD,
				database: process.env.DB_NAME,
				entities: [
					//__dirname + "/entity/*.js",
					Event,
					Team
				],
				migrations: ['./migration/*.js'],
			})
	} catch(error) {
		 console.error(error);
	}
}

export const connection: Promise<Connection> = connect();
