export default async function teardownTestEnvironment(_globalConfig: any, _projectConfig: any) {
	// await (globalThis as any).TEST_MYSQL_CONTAINER.stop()
	// await (globalThis as any).TEST_NETWORK.stop()

	await (globalThis as any).TEST_RABBITMQ_CONTAINER.stop();
}
