import { FastifyInstance } from 'fastify';
import { Knex } from 'knex';
import _ from 'lodash';
import * as db from '../connectors/mysql-connector';
import { HOUSES_TABLE } from '../db/constants';
import { characterSearchSchemas } from '../routes/schemas';
import { House } from '../entities/house';

export async function findMany({
	app,
	searchQuery,
	transaction,
}: {
	app: FastifyInstance;
	searchQuery?: characterSearchSchemas.SearchHouseQuerystring;
	transaction?: Knex.Transaction;
}) {
	const conn = app.knex;
	return await db.buildAndRun<House[]>({
		app,
		transaction,
		callback: async (conn) => {
			if (_.isEmpty(searchQuery)) {
				return conn.table(HOUSES_TABLE).select();
			}

			const query = conn.table(HOUSES_TABLE);

			if (searchQuery.character_ids) {
				query.whereIn('character_id', searchQuery.character_ids);
			}

			if (searchQuery.house_name) {
				query.andWhereILike('name', `%${searchQuery.house_name}%`);
			}

			return query.select();
		},
	});
}
