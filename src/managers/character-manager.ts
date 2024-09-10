import { FastifyInstance } from 'fastify';
import * as characterRepository from '../repositories/character-repository';
// import { characterSchemas } from '../routes/schemas';
import { Character } from '../entities/character';
import { Knex } from 'knex';
import {
	CreateOneCharactersBody,
	UpdateOneCharactersBody,
} from '../routes/schemas/character-schemas';
import { SearchCharactersQuerystring } from '../routes/schemas/character-search-schemas';

export async function findOne({
	app,
	characterId,
	transaction,
}: {
	app: FastifyInstance;
	characterId: number;
	transaction?: Knex.Transaction;
}) {
	return await characterRepository.findOne({ app, characterId, transaction });
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
	return await characterRepository.findMany({ app, searchQuery, transaction });
}

export async function createOne({
	app,
	createData,
	transaction,
}: {
	app: FastifyInstance;
	createData: CreateOneCharactersBody;
	transaction?: Knex.Transaction;
}): Promise<Character> {
	const id = await characterRepository.createOne({ app, data: createData, transaction });

	if (!id) {
		throw new Error('Character: failed to insert new character');
	}

	const character = await characterRepository.findOne({ app, characterId: id, transaction });

	if (!character) {
		throw new Error('Character: failed to find created character');
	}

	return character;
}

export async function updateOne({
	app,
	characterId,
	updateData,
	transaction,
}: {
	app: FastifyInstance;
	characterId: number;
	updateData: UpdateOneCharactersBody;
	transaction?: Knex.Transaction;
}) {
	return await characterRepository.updateOne({
		app,
		id: characterId,
		data: transformUpdateOneCharacter({ characterId, data: updateData }),
		transaction,
	});
}

export async function deleteOne({
	app,
	characterId,
	transaction,
}: {
	app: FastifyInstance;
	characterId: number;
	transaction?: Knex.Transaction;
}) {
	return await characterRepository.deleteOne({ app, id: characterId, transaction });
}

export async function search({
	app,
	searchQuery,
}: {
	app: FastifyInstance;
	searchQuery: SearchCharactersQuerystring;
}) {
	return await characterRepository.findMany({ app, searchQuery });
}

function transformUpdateOneCharacter({
	characterId,
	data,
}: {
	characterId: number;
	data: UpdateOneCharactersBody | CreateOneCharactersBody;
}): Character {
	return {
		id: characterId,
		...data,
	};
}
