import { FastifyInstance } from 'fastify';
import { Knex } from 'knex';
import { actorRepository } from '../repositories';
import { Actor } from '../entities/actor';
import { characterManager } from '.';
import { CreateOneCharacterActorBody } from '../routes/schemas/character-actor-schemas';
import { SearchActorQuerystring } from '../routes/schemas/character-search-schemas';
import _ from 'lodash';

export async function createOne({
	app,
	characterId,
	createData,
	transaction,
}: {
	app: FastifyInstance;
	characterId: number;
	createData: CreateOneCharacterActorBody;
	transaction?: Knex.Transaction;
}): Promise<Actor> {
	if (!characterId) {
		throw new Error('Actor: character id not provided');
	}

	const character = await characterManager.findOne({ app, characterId, transaction });

	if (!character) {
		throw new Error(`Actor: character not found by id: ${characterId}`);
	}

	const id = await actorRepository.createOne({
		app,
		data: { character_id: characterId, ...createData },
		transaction,
	});

	if (!id) {
		throw new Error('Actor: failed to insert new actor');
	}

	const actor = await actorRepository.findOne({ app, actorId: id, transaction });

	if (!actor) {
		throw new Error('Actor: failed to find created actor');
	}

	return actor;
}

export async function findOne({
	app,
	actorId,
	characterId,
	transaction,
}: {
	app: FastifyInstance;
	actorId: number;
	characterId: number;
	transaction?: Knex.Transaction;
}) {
	return await actorRepository.findOne({ app, actorId, characterId, transaction });
}

export async function findMany({
	app,
	searchQuery,
	transaction,
}: {
	app: FastifyInstance;
	searchQuery: SearchActorQuerystring
	transaction?: Knex.Transaction;
}) {
	if (searchQuery && !searchQuery.actor_name && _.isEmpty(searchQuery.character_ids)) {
		return [];
	}
	
	return await actorRepository.findMany({ app, searchQuery, transaction });
}

export async function deleteOne({
	app,
	actorId,
	characterId,
	transaction,
}: {
	app: FastifyInstance;
	actorId: number;
	characterId: number;
	transaction?: Knex.Transaction;
}) {
	return await actorRepository.deleteOne({ app, actorId, characterId, transaction });
}
