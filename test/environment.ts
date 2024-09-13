import { FastifyInstance } from 'fastify';
import { Network } from 'testcontainers';
import { initMysqlContainer } from './functional/db/mysql';
import { StartedMySqlContainer } from '@testcontainers/mysql';

let app: FastifyInstance;
let mysqlContainer: StartedMySqlContainer | null;

export async function startTestEnv(): Promise<FastifyInstance> {
	const app = require('../src/app').default;

	await app.ready();

	return app;
}

export async function stopTestEnv(app: FastifyInstance): Promise<void> {
	// await app?.knex?.destroy()
	await app?.close();
}

export async function startMysqlDbContainer() {
	if (mysqlContainer) {
		return mysqlContainer;
	}
	const network = await new Network().start();

	mysqlContainer = await initMysqlContainer({
		network,
		database: `testdb_${Math.random().toString(36).substring(2, 15)}`,
		username: 'testor',
		password: 'testor',
		port: 3306,
	});

	return mysqlContainer;
}

export async function stopMysqlDbContainer(container?: StartedMySqlContainer) {
	await container?.stop();
	// setTimeout(async () => {

	// 	mysqlContainer = null;
	// }, 5000);
}
