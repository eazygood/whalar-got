import { FastifyInstance } from 'fastify';
import { Knex } from 'knex';
import { SearchRelationshipsQuerystring } from '../routes/schemas/character-search-schemas';
import { relationshipsRepository } from '../repositories';

export async function findMany({
	app,
	searchQuery,
	transaction,
}: {
	app: FastifyInstance;
	searchQuery: SearchRelationshipsQuerystring;
	transaction?: Knex.Transaction;
}) {
	return await relationshipsRepository.findMany({ app, searchQuery, transaction });
}
