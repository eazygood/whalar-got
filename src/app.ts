import fastify from 'fastify';
import fastifyRabbitMQ from 'fastify-amqp';
import knexPlugin from './plugins/knex-plugin';
import * as mysqlConnector from './connectors/mysql-connector';
import * as rabbitmqConnector from './connectors/rabbitmq-connector';
import registerPublicRoutes from './routes';

const f = fastify();

export default f
	.register(knexPlugin, mysqlConnector.getConfig)
	.register(mysqlConnector.registerMysqlDatabase)
	// .register(fastifyRabbitMQ, rabbitmqConnector.getConfig())
	.register(registerPublicRoutes, { prefix: 'characters' });
