import { FastifyInstance } from 'fastify';
import { characterManager } from '../managers';
import console from 'console';

export async function registerCharacterQueue(app: FastifyInstance) {
	try {
		const queue = 'hello';
		const channel = app.amqp.channel;
		await channel.assertQueue(queue, {
			durable: true,
		});

		channel.consume(queue, async (msg: any) => {
			if (msg !== null) {
				await characterManager.processMessage({ app, message: msg.content.toString() });

				channel.ack(msg);
			}
		});
	} catch (err) {
		app.log.error('error consuming messages:', err);
	}
}
