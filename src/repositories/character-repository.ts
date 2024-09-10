import { FastifyInstance } from 'fastify';
import _ from 'lodash';
import * as db from '../connectors/mysql-connector';
import { Character, CharacterToAdd } from '../entities/character';
import { CHARACTERS_TABLE } from '../db/constants';
import { characterSchemas } from '../routes/schemas';
import { Knex } from 'knex';

export async function findOne({
	app,
	characterId,
	transaction,
}: {
	app: FastifyInstance;
	characterId: number;
	transaction?: Knex.Transaction
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
}: {
	app: FastifyInstance;
	searchQuery?: characterSchemas.SearchCharactersQuerystring;
}) {
	const conn = app.knex;
	return await db.buildAndRun<Character[]>({
		app,
		callback: async (conn) => {
			console.log('searchQuery: ', searchQuery);
			if (!searchQuery) {
				return conn.table(CHARACTERS_TABLE).select();
			}

			const query = conn.table(CHARACTERS_TABLE).select();

			console.log('NAME', searchQuery.name);

			if (searchQuery.name) {
				query.andWhere({ name: searchQuery.name });
			}

			if (searchQuery.nickname) {
				query.andWhere({ nickname: searchQuery.nickname });
			}

			if (searchQuery.kingsguard) {
				query.andWhere({ kingsguard: searchQuery.kingsguard });
			}

			if (searchQuery.royal) {
				query.andWhere({ royal: searchQuery.royal });
			}

			return query;
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
			await conn.table(CHARACTERS_TABLE).delete().where({ id });

			return id;
		},
	});
}
