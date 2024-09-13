import { Network } from 'testcontainers';
import { initMysqlContainer } from './env-builds/mysql';
import { initRabbitMqContainer } from './env-builds/rabbitmq';

export default async function setupTestEnvironment(_globalConfig: any, _projectConfig: any) {
	// const network = await new Network().start();
	// const mysqlContainer = await initMysqlContainer({
	// 	network,
	// 	database: 'db',
	// 	username: 'testor',
	// 	password: 'testor',
	// 	port: 3306,
	// });

	const rabbitmqContainer = await initRabbitMqContainer();
	// (globalThis as any).TEST_MYSQL_CONTAINER = mysqlContainer;
	(globalThis as any).TEST_RABBITMQ_CONTAINER = rabbitmqContainer;
	// (globalThis as any).TEST_NETWORK = network
}
