import { FastifyInstance } from 'fastify';
import { CreateOneCharactersEventPayload, EntityEvent } from '../entities/event';
import { produceEventToRabbitMq } from '../repositories/event-repository';

export async function publishOneCreate({
	app,
	queue,
	body,
}: {
	app: FastifyInstance;
	queue: string;
	body: EntityEvent;
}): Promise<void> {
	// build entity domain and produce
	await produceEventToRabbitMq<CreateOneCharactersEventPayload>({ app, queue, body });
}

export async function publishOneUpdate({
	app,
	queue,
	body,
}: {
	app: FastifyInstance;
	queue: string;
	body: EntityEvent;
}): Promise<void> {
	// build entity domain and produce
	await produceEventToRabbitMq<CreateOneCharactersEventPayload>({ app, queue, body });
}
