import { FastifyInstance } from 'fastify';
import { Knex } from 'knex';
import { allyRepository } from '../repositories';
import { SearchAllyQuerystring } from '../routes/schemas/character-search-schemas';

export async function findMany({
	app,
	searchQuery,
	transaction,
}: {
	app: FastifyInstance;
	searchQuery: SearchAllyQuerystring;
	transaction?: Knex.Transaction;
}) {
	return await allyRepository.findMany({ app, searchQuery, transaction });
}
