import { FastifyInstance } from 'fastify';
import { Network } from 'testcontainers';
import { initMysqlContainer } from './env-builds/mysql';
import { initRabbitMqContainer } from './env-builds/rabbitmq';
import { StartedMySqlContainer } from '@testcontainers/mysql';
import { StartedRabbitMQContainer } from '@testcontainers/rabbitmq';

let mysqlContainer: StartedMySqlContainer | null;

export async function startTestEnv(): Promise<FastifyInstance> {
	const main = require('../src/app').default;
	const app = await main();

	await app.ready();

	return app;
}

export async function stopTestEnv(app: FastifyInstance): Promise<void> {
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
}

export async function startRabbitMqContainer() {
	return await initRabbitMqContainer();
}

export async function stopRabbitMqContainer(container?: StartedRabbitMQContainer) {
	await container?.stop();
}

export function getKnexPluginMock() {
	return {
		raw: jest.fn(),
		destroy: jest.fn(),
		migrate: {
			latest: jest.fn(),
		},
		table: {},
	};
}

export function getRabbitmqMock() {
	return {};
}
