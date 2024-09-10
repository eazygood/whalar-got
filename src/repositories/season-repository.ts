import { FastifyInstance } from "fastify";
import { Knex } from "knex";
import _ from "lodash";
import * as db from '../connectors/mysql-connector';
import { SEASONS_TABLE } from "../db/constants";
import { characterSearchSchemas } from "../routes/schemas";
import { Season } from "../entities/season";

export async function findMany({
	app,
	searchQuery,
	transaction,
}: {
	app: FastifyInstance;
	searchQuery?: characterSearchSchemas.SearchSeasonQuerystring;
	transaction?: Knex.Transaction;
}) {
	const conn = app.knex;
	return await db.buildAndRun<Season[]>({
		app,
		transaction,
		callback: async (conn) => {
			console.log('searchQuery: ', searchQuery);

			if (_.isEmpty(searchQuery)) {
				return conn.table(SEASONS_TABLE).select();
			}

			const query = conn.table(SEASONS_TABLE);

			if (searchQuery.actor_ids) {
				query.whereIn('actor_id', searchQuery.actor_ids);
			}

			return query.select();
		},
	});
}