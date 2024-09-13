import { FastifyInstance } from 'fastify';
import { Knex } from 'knex';
import _ from 'lodash';
import * as db from '../connectors/mysql-connector';
import { ALLIES_TABLE } from '../db/constants';
import { Ally } from '../entities/ally';
import { SearchAllyQuerystring } from '../routes/schemas/character-search-schemas';

export async function findMany({
	app,
	searchQuery,
	transaction,
}: {
	app: FastifyInstance;
	searchQuery?: SearchAllyQuerystring;
	transaction?: Knex.Transaction;
}) {
	const conn = app.knex;
	return await db.buildAndRun<Ally[]>({
		app,
		transaction,
		callback: async (conn) => {
			if (_.isEmpty(searchQuery)) {
				return conn.table(ALLIES_TABLE).select();
			}

			const query = conn.table(ALLIES_TABLE);

			if (searchQuery.character_ids) {
				query.whereIn('character_id', searchQuery.character_ids);
			}

			return query.select();
		},
	});
}
