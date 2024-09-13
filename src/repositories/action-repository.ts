import { FastifyInstance } from 'fastify';
import { Knex } from 'knex';
import _ from 'lodash';
import * as db from '../connectors/mysql-connector';
import { ACTIONS_TABLE, RELATIONSHIPS_TABLE } from '../db/constants';
import { characterSearchSchemas } from '../routes/schemas';
import { Action } from '../entities/action';

export async function findMany({
	app,
	searchQuery,
	transaction,
}: {
	app: FastifyInstance;
	searchQuery?: characterSearchSchemas.SearchActionsQuerystring;
	transaction?: Knex.Transaction;
}) {
	const conn = app.knex;
	return await db.buildAndRun<Action[]>({
		app,
		transaction,
		callback: async (conn) => {
			if (_.isEmpty(searchQuery)) {
				return conn.table(ACTIONS_TABLE).select();
			}

			const query = conn.table(ACTIONS_TABLE);

			if (searchQuery.character_ids) {
				query.whereIn('character_id', searchQuery.character_ids);
			}

			return query.select();
		},
	});
}
