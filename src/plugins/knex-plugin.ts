import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import Knex = require('knex');

declare module 'fastify' {
	interface FastifyInstance {
		knex: Knex.Knex;
	}
}
const knexPlugin = async (fastify: FastifyInstance, options: any) => {
	// TODO: can be configured with pool connection
	// const connection  = mysql.createConnection(options);
	const knex = Knex(options);
	fastify.decorate('knex', knex);

	fastify.addHook('onClose', async () => {
		await fastify.knex.destroy();
	});
};

export default fp(knexPlugin, {
	name: 'knex',
});
