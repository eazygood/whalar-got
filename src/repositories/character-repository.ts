import { FastifyInstance } from 'fastify';
import _ from 'lodash';
import * as db from '../connectors/mysql-connector';
import { Character, CharacterToAdd } from '../entities/character';
import { CHARACTERS_TABLE } from '../db/constants';
import { Knex } from 'knex';
import { SearchCharactersQuerystring } from '../routes/schemas/character-search-schemas';

export async function findOne({
	app,
	characterId,
	transaction,
}: {
	app: FastifyInstance;
	characterId: number;
	transaction?: Knex.Transaction;
}): Promise<Character | undefined> {
	return await db.buildAndRun<Character | undefined>({
		app,
		transaction,
		callback: async (conn) => {
			return conn.table(CHARACTERS_TABLE).select().where({ id: characterId }).first();
		},
	});
}

export async function findMany({
	app,
	searchQuery,
	transaction,
}: {
	app: FastifyInstance;
	searchQuery?: SearchCharactersQuerystring;
	transaction?: Knex.Transaction;
}) {
	const conn = app.knex;
	return await db.buildAndRun<Character[]>({
		app,
		transaction,
		callback: async (conn) => {
			console.log('searchQuery: ', searchQuery);

			if (_.isEmpty(searchQuery)) {
				return conn.table(CHARACTERS_TABLE).select();
			}

			const query = conn.table(CHARACTERS_TABLE);

			console.log('NAME', searchQuery.name);

			if (searchQuery.character_ids) {
				query.whereIn('id', searchQuery.character_ids);
			}

			if (searchQuery.name) {
				query.whereILike('name', `%${searchQuery.name}%`);
			}

			if (searchQuery.nickname) {
				query.orWhereILike('nickname', `%${searchQuery.name}%`);
			}

			return query.select();
		},
	});
}

export async function createOne({
	app,
	data,
	transaction,
}: {
	app: FastifyInstance;
	data: CharacterToAdd;
	transaction?: Knex.Transaction;
}): Promise<number> {
	return await db.buildAndRun<number>({
		app,
		transaction,
		callback: async (conn) => {
			const [id] = await conn.table(CHARACTERS_TABLE).insert(data);

			return id;
		},
	});
}

export async function updateOne({
	app,
	id,
	data,
	transaction,
}: {
	app: FastifyInstance;
	id: number;
	data: Character;
	transaction?: Knex.Transaction;
}) {
	return await db.buildAndRun<Character>({
		app,
		transaction,
		callback: async (conn) => {
			return conn.table(CHARACTERS_TABLE).update<Character>(_.omit(data, 'id')).where({ id });
		},
	});
}

export async function deleteOne({
	app,
	id,
	transaction,
}: {
	app: FastifyInstance;
	id: number;
	transaction?: Knex.Transaction;
}): Promise<number> {
	return await db.buildAndRun<number>({
		app,
		transaction,
		callback: async (conn) => {
			return await conn.table(CHARACTERS_TABLE).delete().where({ id });
		},
	});
}

export async function deleteAll({
	app,
	transaction,
}: {
	app: FastifyInstance;
	transaction?: Knex.Transaction;
}): Promise<void> {
	return await db.buildAndRun<void>({
		app,
		transaction,
		callback: async (conn) => {
			await conn.table(CHARACTERS_TABLE).del();
		}
	});
}
