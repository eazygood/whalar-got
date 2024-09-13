import { FastifyInstance } from 'fastify';
import { characterManager } from '../../managers';
import { CREATE_CHARACTERS_QUEUE_RABBITMQ } from '../constants';

export async function registerCharacterQueue(app: FastifyInstance) {
	try {
		const channel = app.amqp.channel;
		await channel.assertQueue(CREATE_CHARACTERS_QUEUE_RABBITMQ, {
			durable: true,
		});

		channel.consume(CREATE_CHARACTERS_QUEUE_RABBITMQ, async (msg: any) => {
			if (msg !== null) {
				await characterManager.processMessage({ app, message: msg.content.toString() });

				channel.ack(msg);
			}
		});
	} catch (err) {
		app.log.error('error consuming messages:', err);
	}
}
