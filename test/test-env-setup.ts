import { Network } from 'testcontainers';
import { initMysqlContainer } from './env-builds/mysql';
import { initRabbitMqContainer } from './env-builds/rabbitmq';

export default async function setupTestEnvironment(_globalConfig: any, _projectConfig: any) {
	const rabbitmqContainer = await initRabbitMqContainer();
	(globalThis as any).TEST_RABBITMQ_CONTAINER = rabbitmqContainer;
}
