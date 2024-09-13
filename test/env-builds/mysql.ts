import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { StartedNetwork } from 'testcontainers';

export async function initMysqlContainer({
	network,
	username,
	password,
	database,
	port,
}: {
	network: StartedNetwork;
	username: string;
	password: string;
	database: string;
	port: number;
}): Promise<StartedMySqlContainer> {
	const mysqlContainer = await new MySqlContainer()
		.withName(`test_db_container_${database}`)
		.withRootPassword(password)
		.withUsername(username)
		.withUserPassword(password)
		.withDatabase(database)
		.withEnvironment({
			MYSQL_ROOT_PASSWORD: password,
			MYSQL_DB: database,
		})
		.withExposedPorts(port)
		.withNetwork(network)
		.start();

	process.env['TEST_MYSQL_CONNETION_URI'] = mysqlContainer.getConnectionUri();
	process.env['MYSQL_DATABASE'] = database;

	return mysqlContainer;
}
