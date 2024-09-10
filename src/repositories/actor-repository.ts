import { FastifyInstance } from 'fastify';
import { Knex } from 'knex';
import { ACTORS_TABLE, CHARACTERS_TABLE } from '../db/constants';
import { Actor, ActorToAdd } from '../entities/actor';
import * as db from '../connectors/mysql-connector';
import _ from 'lodash';
import { characterSearchSchemas } from '../routes/schemas';

export async function createOne({
	app,
	data,
	transaction,
}: {
	app: FastifyInstance;
	data: ActorToAdd;
	transaction?: Knex.Transaction;
}) {
	return await db.buildAndRun<number>({
		app,
		transaction,
		callback: async (conn) => {
			const [id] = await conn.table(ACTORS_TABLE).insert(data);

			return id;
		},
	});
}

export async function findOne({
	app,
	actorId,
	characterId,
	transaction,
}: {
	app: FastifyInstance;
	actorId: number;
	characterId?: number;
	transaction?: Knex.Transaction;
}): Promise<Actor | undefined> {
	return await db.buildAndRun<Actor | undefined>({
		app,
		transaction,
		callback: async (conn) => {
			return conn
				.table(ACTORS_TABLE)
				.select()
				.where({
					id: actorId,
					...(characterId ? { character_id: characterId } : null),
				})
				.first();
		},
	});
}

export async function findMany({
	app,
	searchQuery,
	transaction,
}: {
	app: FastifyInstance;
	searchQuery?: characterSearchSchemas.SearchActorQuerystring;
	transaction?: Knex.Transaction;
}) {
	const conn = app.knex;
	return await db.buildAndRun<Actor[]>({
		app,
		transaction,
		callback: async (conn) => {
			console.log('searchQuery: ', searchQuery);

			console.log(searchQuery);


			if (_.isEmpty(searchQuery)) {
				return conn.table(ACTORS_TABLE).select();
			}

			const query = conn.table(ACTORS_TABLE);

			if (searchQuery.character_ids) {
				query.whereIn('character_id', searchQuery.character_ids);
			}

			if (searchQuery.actor_name) {
				query.andWhereILike('name', `%${searchQuery.actor_name}%`);
			}


			return query.select();
		},
	});
}

export async function deleteOne({
	app,
	actorId,
	characterId,
	transaction,
}: {
	app: FastifyInstance;
	actorId: number;
	characterId?: number;
	transaction?: Knex.Transaction;
}): Promise<number> {
	return await db.buildAndRun<number>({
		app,
		transaction,
		callback: async (conn) => {
			await conn
				.table(ACTORS_TABLE)
				.delete()
				.where({
					id: actorId,
					...(characterId ? { character_id: characterId } : null),
				});

			return actorId;
		},
	});
}
