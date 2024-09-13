export default async function teardownTestEnvironment(_globalConfig: any, _projectConfig: any) {
	await (globalThis as any).TEST_RABBITMQ_CONTAINER.stop();
}
