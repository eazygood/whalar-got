import { FastifyInstance } from 'fastify';
import path from 'path';
import { Knex } from 'knex';

export function getConfig() {
	return {
		client: 'mysql2',
		connection: {
			host: process.env.MYSQL_HOST,
			user: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD,
			database: process.env.MYSQL_DATABASE,
		},
	};
}

export async function registerMysqlDatabase(app: FastifyInstance): Promise<void> {
	await app.knex.raw('SELECT 1');

	console.log('run seeds');

	await app.knex.migrate.latest({
		database: 'db',
		directory: path.join(__dirname, '../db/migrations'),
	});

	await app.knex.seed.run({
		directory: path.join(__dirname, '../db/seeds'),
	});
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
		throw new Error('An error occurred while calling the database');
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

		throw new Error('database commit failed');
	}
}

export async function seedDb(app: FastifyInstance) {}
