import fastify from 'fastify';
import fastifyRabbitMq from 'fastify-amqp';

import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import knexPlugin from './plugins/knex-plugin';
import registerPublicRoutes from './routes';

import { swaggerConfig } from './config/swagger-config';
import { mysqlConfig, registerMysqlDatabase } from './connectors/mysql-connector';


export default async function main() {
	const app = fastify();

	await app
		.register(swagger, swaggerConfig)
		.register(swaggerUi, {
			routePrefix: '/docs',
		})
		.register(knexPlugin, mysqlConfig)
		.register(registerMysqlDatabase)
		.register(registerPublicRoutes, { prefix: 'characters' });
		// .register(fastifyRabbitMQ, rabbitmqConnector.getConfig())

	return app;
}
