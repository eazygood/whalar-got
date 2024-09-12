import { FastifyInstance } from 'fastify';
import path from 'path';
import { Knex } from 'knex';

export function getConfig() {
	if (process.env.TEST_MYSQL_CONNETION_URI) {
		return {
			client: 'mysql2',
			connection: process.env.TEST_MYSQL_CONNETION_URI,
		};
	}
	return {
		client: 'mysql2',
		connection: {
			host: process.env.MYSQL_HOST,
			user: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD,
			database: process.env.MYSQL_DATABASE,
			port: process.env.MYSQL_PORT || '3306',
		},
	};
}

export async function registerMysqlDatabase(app: FastifyInstance): Promise<void> {
	await app.knex.raw('SELECT 1');

	await app.knex.migrate.latest({
		database: process.env.MYSQL_DATABASE,
		directory: path.join(__dirname, '../db/migrations'),
	});

	// if (process.env.TEST_ENV) {
	// 	await app.knex.seed.run({
	// 		directory: path.join(__dirname, '../db/seeds'),
	// 	});
	// }
}

export async function buildAndRun<T>({
	app,
	callback,
	transaction,
}: {
	app: FastifyInstance;
	callback: (connection: Knex) => Promise<T>;
	transaction?: Knex.Transaction;
}): Promise<T> {
	try {
		const conenction = transaction || app.knex;
		return await callback(conenction);
	} catch (err) {
		throw new Error('An error occurred while calling the database', {
			cause: err,
		});
	}
}

export async function withinTransaction<T>({
	app,
	callback,
}: {
	app: FastifyInstance;
	callback: (trx: Knex.Transaction) => Promise<T>;
}): Promise<T> {
	const trx = await app.knex.transaction();

	try {
		const data = await callback(trx);

		await trx.commit();

		return data;
	} catch (err) {
		await trx.rollback();

		console.log(err);
		throw new Error('database commit failed', {
			cause: err,
		});
	}
}

export async function seedDb(app: FastifyInstance) {}
