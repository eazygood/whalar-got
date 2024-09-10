import { FastifyInstance } from 'fastify';
import { Knex } from 'knex';
import { actionRepository } from '../repositories';
import { SearchActionsQuerystring } from '../routes/schemas/character-search-schemas';

export async function findMany({
	app,
	searchQuery,
	transaction,
}: {
	app: FastifyInstance;
	searchQuery: SearchActionsQuerystring;
	transaction?: Knex.Transaction;
}) {
	return await actionRepository.findMany({ app, searchQuery, transaction });
}
