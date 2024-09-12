import { Network } from 'testcontainers';
import { initMysqlContainer } from './functional/db/mysql';

export default async function setupTestEnvironment(_globalConfig: any, _projectConfig: any) {
	// const network = await new Network().start();
	// const mysqlContainer = await initMysqlContainer({
	// 	network,
	// 	database: 'db',
	// 	username: 'testor',
	// 	password: 'testor',
	// 	port: 3306,
	// });

	

	// (globalThis as any).TEST_MYSQL_CONTAINER = mysqlContainer;
    // (globalThis as any).TEST_NETWORK = network
}
