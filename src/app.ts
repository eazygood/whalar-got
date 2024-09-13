import fastify from 'fastify';
import fastifyRabbitMq from 'fastify-amqp';

import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import knexPlugin from './plugins/knex-plugin';
import registerPublicRoutes from './routes';

import { mysqlConfig, registerMysqlDatabase } from './connectors/mysql-connector';
import { registerCharacterQueue } from './message-queues/consumers/characters-queue';
import { rabbitmqConfig, swaggerConfig } from './config';

export default async function main() {
	const app = fastify();

	await app
		.register(swagger, swaggerConfig)
		.register(swaggerUi, {
			routePrefix: '/docs',
		})
		.register(knexPlugin, mysqlConfig)
		.register(registerMysqlDatabase)
		.register(registerPublicRoutes, { prefix: 'characters' })
		.register(fastifyRabbitMq, rabbitmqConfig)
		.register(registerCharacterQueue);

	return app;
}
