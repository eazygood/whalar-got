import { FastifyInstance } from 'fastify';
import { Knex } from 'knex';
import { houseRepository } from '../repositories';
import { SearchActorQuerystring } from '../routes/schemas/character-search-schemas';

export async function findMany({
	app,
	searchQuery,
	transaction,
}: {
	app: FastifyInstance;
	searchQuery: SearchActorQuerystring;
	transaction?: Knex.Transaction;
}) {
	return await houseRepository.findMany({ app, searchQuery, transaction });
}
