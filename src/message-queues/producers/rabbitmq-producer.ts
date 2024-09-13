import { FastifyInstance } from "fastify";

export async function produceToRabbitMq({ app, queue, body}: {app: FastifyInstance; queue: string; body: Record<string, any>}) {
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
