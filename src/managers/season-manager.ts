import { FastifyInstance } from 'fastify';
import { Knex } from 'knex';
import { seasonRepository } from '../repositories';
import { SearchSeasonQuerystring } from '../routes/schemas/character-search-schemas';
import _ from 'lodash';

export async function findMany({
	app,
	searchQuery,
	transaction,
}: {
	app: FastifyInstance;
	searchQuery: SearchSeasonQuerystring;
	transaction?: Knex.Transaction;
}) {
	if (searchQuery && _.isEmpty(searchQuery.actor_ids)) {
		return [];
	}

	return await seasonRepository.findMany({ app, searchQuery, transaction });
}
