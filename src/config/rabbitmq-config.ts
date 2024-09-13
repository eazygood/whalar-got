export function rabbitmqConfig() {
	if (process.env.TEST_RABBITMQ_CONNETION_URI) {
		return {
			url: process.env.TEST_RABBITMQ_CONNETION_URI,
		};
	}
	
	return {
		hostname: process.env.RABBITMQ_HOST || 'localhost',
		port: Number(process.env.RABBITMQ_PORT) || 5672,
		username: process.env.RABBITMQ_USERNAME || 'rabbitmq',
		password: process.env.RABBITMQ_PASSWORD || 'rabbitmq',
		vhost: '',
	};
}
