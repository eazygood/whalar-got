import { FastifyInstance } from 'fastify';

export async function produceEventToRabbitMq<T>({
	app,
	queue,
	body,
}: {
	app: FastifyInstance;
	queue: string;
	body: T;
}) {
	try {
		const channel = app.amqp.channel;
		await channel.assertQueue(queue, {
			durable: true,
		});

		channel.sendToQueue(queue, Buffer.from(JSON.stringify(body)));
	} catch (err) {
		app.log.error('error consuming messages:', err);
	}
}
