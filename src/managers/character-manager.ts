import { FastifyInstance } from 'fastify';
import _ from 'lodash';
import * as characterRepository from '../repositories/character-repository';
// import { characterSchemas } from '../routes/schemas';
import { Character } from '../entities/character';
import { Knex } from 'knex';
import {
	CreateOneCharactersBody,
	UpdateOneCharactersBody,
} from '../routes/schemas/character-schemas';
import { SearchCharactersQuerystring } from '../routes/schemas/character-search-schemas';
import { Actor } from '../entities/actor';
import { House } from '../entities/house';
import {
	ActionsExtended,
	ActorWithSeason,
	AlliesExtended,
	RelationshipsExtended,
} from '../mediators/character-details-mediator';

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

export function mapCharacters({
	characters,
	actors,
	houses,
	actions,
	relationships,
	allies,
}: {
	characters: Character[];
	actors: ActorWithSeason[];
	houses: House[];
	actions: ActionsExtended[];
	relationships: RelationshipsExtended[];
	allies: AlliesExtended[];
}) {
	return characters.map((character) => {
		const characterId = character.id;
		const houseMapped = mapHouses({ houses, characterId });
		const actorsMapped = mapActors({ actors, characterId });
		const relationshipsMapped = mapRelationShips({ relationships, characterId });
		const actionsMapped = mapActions({ actions, characterId });
		const alliesMapped = mapAllies({ allies, characterId });

		return {
			characterName: character.name,
			...houseMapped,
			...(character.nickname ? { nickname: character.nickname } : null),
			...(character.image_thumb ? { characterImageThumb: character.image_thumb } : null),
			...(character.image_full ? { characterImageFull: character.image_full } : null),
			...(character.link ? { characterLink: character.link } : null),
			...actorsMapped,
			...relationshipsMapped,
			...actionsMapped,
			...alliesMapped,
		};
	});
}

function mapHouses({ houses, characterId }: { houses: House[]; characterId: number }) {
	const filtered = houses
		.filter((house) => house.character_id === characterId)
		.map((house) => house.name);

	if (filtered.length > 1) {
		return { houseName: filtered };
	}

	return { houseName: filtered[0] };
}

function mapActors({ actors, characterId }: { actors: ActorWithSeason[]; characterId: number }) {
	const extendedActors = actors
		.filter((actor) => actor.character_id === characterId)
		.map((actor) => ({
			actorName: actor.name,
			actorLink: actor.link,
			seasonsActive: actor.season_active,
		}));

	if (_.isEmpty(extendedActors)) {
		return null;
	}

	if (extendedActors.length > 1) {
		return { actors: extendedActors };
	}

	return _.pick(extendedActors[0], ['actorName', 'actorLink']);
}

function mapRelationShips({
	relationships,
	characterId,
}: {
	relationships: RelationshipsExtended[];
	characterId: number;
}) {
	return _.chain(relationships)
		.filter({ character_id: characterId })
		.groupBy('type')
		.mapValues((items) => _.map(items, 'name'))
		.value();
}

function mapActions({ actions, characterId }: { actions: ActionsExtended[]; characterId: number }) {
	const a = _.chain(actions)
		.filter({ character_id: characterId })
		.groupBy('type')
		.mapValues((items) => _.map(items, 'name'))
		.value();

	console.log(actions, characterId, a);
	return a;
}
function mapAllies({ allies, characterId }: { allies: AlliesExtended[]; characterId: number }) {
	return _.chain(allies)
		.filter({ character_id: characterId })
		.map('name')
		.thru((alliesFiltered) => (!_.isEmpty(alliesFiltered) ? { allies: alliesFiltered } : null))
		.value();
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
