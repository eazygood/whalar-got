import { FastifyInstance } from 'fastify';
import { Knex } from 'knex';
import _ from 'lodash';
import * as db from '../connectors/mysql-connector';
import { RELATIONSHIPS_TABLE } from '../db/constants';
import { House } from '../entities/house';
import { characterSearchSchemas } from '../routes/schemas';
import { Relationship } from '../entities/relationship';

export async function findMany({
	app,
	searchQuery,
	transaction,
}: {
	app: FastifyInstance;
	searchQuery?: characterSearchSchemas.SearchRelationshipsQuerystring;
	transaction?: Knex.Transaction;
}) {
	const conn = app.knex;
	return await db.buildAndRun<Relationship[]>({
		app,
		transaction,
		callback: async (conn) => {
			if (_.isEmpty(searchQuery)) {
				return conn.table(RELATIONSHIPS_TABLE).select();
			}

			const query = conn.table(RELATIONSHIPS_TABLE);

			if (searchQuery.character_ids) {
				query.whereIn('character_id', searchQuery.character_ids);
			}

			return query.select();
		},
	});
}
