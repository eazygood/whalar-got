import { RabbitMQContainer, StartedRabbitMQContainer } from '@testcontainers/rabbitmq';

export async function initRabbitMqContainer(): Promise<StartedRabbitMQContainer> {
	const rabbitmqContainer = await new RabbitMQContainer().start();

	process.env['TEST_RABBITMQ_CONNETION_URI'] = rabbitmqContainer.getAmqpUrl();

	return rabbitmqContainer;
}
