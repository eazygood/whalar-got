import { FastifyInstance } from 'fastify';
import * as characterRepository from '../repositories/characters';
import { SearchCharactersQuerystring } from '../routes/schemas';
import { Character, CharacterToAdd } from '../entities/character';
import { Knex } from 'knex';
import {
	CreateOneCharactersBody,
	UpdateOneCharactersBody,
} from '../routes/schemas/characters-schemas';

export async function findOne({ app, characterId }: { app: FastifyInstance; characterId: number }) {
	return await characterRepository.findOne({ app, id: characterId });
}

export async function findMany({ app }: { app: FastifyInstance }) {
	return await characterRepository.findMany({ app });
}

export async function createOne({
	app,
	createData,
	transaction,
}: {
	app: FastifyInstance;
	createData: CreateOneCharactersBody;
	transaction?: Knex.Transaction;
}) {
	return await characterRepository.createOne({ app, data: createData, transaction });
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
