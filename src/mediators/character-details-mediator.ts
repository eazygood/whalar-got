import _ from 'lodash';
import { FastifyInstance } from 'fastify';
import {
	actionManager,
	actorManager,
	allyManager,
	characterManager,
	houseManager,
	relationshipsManager,
	seasonManager,
} from '../managers';
import { Knex } from 'knex';
import { FieldTypes, SearchItemsQueryString } from '../routes/schemas/character-search-schemas';
import { Actor } from '../entities/actor';
import { House } from '../entities/house';
import { Character } from '../entities/character';
import { mapCharacters } from '../managers/character-manager';

export type CharactersExtended = {
	characters: Character[];
	characterIds: number[];
};
export type ActorWithSeason = Actor & { season_active?: number[] };
export type RelationshipsExtended = { character_id: number; type: string; name: string };
export type ActionsExtended = { character_id: number; type: string; name: string };
export type AlliesExtended = { character_id: number; name: string };

const characterRolesArray: FieldTypes[] = Object.values(FieldTypes);

export async function findMany({
	app,
	searchQuery,
	transaction,
}: {
	app: FastifyInstance;
	searchQuery: SearchItemsQueryString;
	transaction?: Knex.Transaction;
}) {
	const { term, entityTypes, fields, searchForRelatedItems } = searchQuery;

	if (!term) {
		throw new Error('Search: term not defined');
	}

	if (!entityTypes) {
		throw new Error('Search: at least 1 entity type should be defined');
	}

	const entityTypesToUse = entityTypes.split(',');
	const fieldsToUse = (fields ? fields.split(',') : characterRolesArray) as FieldTypes[];
	const responseResult: any = { characters: [] };

	if (entityTypesToUse.includes('character') && searchForRelatedItems) {
		const { characters, characterIds } = await getCharacters({
			app,
			term,
			fields: fieldsToUse,
			transaction,
		});

		const actors = await getActors({
			app,
			term,
			fields: fieldsToUse,
			searchForRelatedItems,
			characterIds,
			transaction,
		});

		const houses = await getHouses({
			app,
			searchForRelatedItems,
			characterIds,
			transaction,
		});

		const relationships = await getRelationship({
			app,
			characterIds,
			searchForRelatedItems,
			transaction,
		});

		const actions = await getActions({
			app,
			characterIds,
			searchForRelatedItems,
			transaction,
		});

		const allies = await getAllies({
			app,
			searchForRelatedItems,
			characterIds,
			transaction,
		});

		const mappedData = mapCharacters({
			actors,
			houses,
			actions,
			allies,
			characters,
			relationships,
		});

		console.log(mappedData);
		responseResult.characters = mappedData;
	}

	if (entityTypesToUse.includes('actor')) {
	}

	if (entityTypesToUse.includes('house')) {
	}

	// ?term="looking for it",entityTypes=character,actor,house,ally,relationship,action,season,fields=name,nickname,actor_name,house_name,link
	// term= string
	// searchForRelatedItems=boolean(true)
	// entityTypes=entities_string_comma_separated
	// fields=default (all)
	// find characters by name / nickname
	// if searchForRelatedItems === true
	// add relationships
	// add actions
	// add actors
	// add seasons
	// add allies
	// add houses
	// else
	// only characters

	// const characters = characterManager.findMany({ app, searchQuery });

	//
	// find actors by actor name
	// if searchForRelatedItems === true
	// find characters by id from actors
	// find seasons by actor id
	// find actions by characters id
	// find relationship by characters id
	// find allies by characters id
	// find houses by characters id
	// else
	// only actors
	// find houses by house name
	// if searchForRelatedItems === true
	// find characters by ids from houses
	// find actions by characters id
	// find relationship by characters id
	// find allies by characters id
	// find actors by characters id
	// find seasons by actor id
	// only houses
	// find allies by ally name  with characters join
	// if searchForRelatedItems === true
	// find characters by ids from allies
	// find actions by characters id
	// find relationship by characters id
	// find houses by characters id
	// find actors by characters id
	// find seasons by actor id

	return responseResult;
}

async function getCharacters({
	app,
	term,
	fields,
	transaction,
}: {
	app: FastifyInstance;
	term: string;
	fields: FieldTypes[];
	transaction?: Knex.Transaction;
}): Promise<CharactersExtended> {
	const fieldsToSearch: { name?: string; nickname?: string } = {};
	if (fields.includes(FieldTypes.name)) {
		fieldsToSearch[FieldTypes.name] = term;
	}

	if (fields.includes(FieldTypes.nickname)) {
		fieldsToSearch[FieldTypes.nickname] = term;
	}

	if (_.isEmpty(fieldsToSearch)) {
		throw new Error('Search: character fields not provided');
	}

	const characters = await characterManager.findMany({
		app,
		searchQuery: {
			...fieldsToSearch,
		},
		transaction,
	});

	return {
		characters,
		characterIds: characters.map((c) => c.id),
	};
}

async function getActors({
	app,
	term,
	fields,
	searchForRelatedItems = false,
	characterIds = [],
	transaction,
}: {
	app: FastifyInstance;
	term: string;
	fields: FieldTypes[];
	searchForRelatedItems: boolean;
	characterIds?: number[];
	transaction?: Knex.Transaction;
}): Promise<ActorWithSeason[]> {
	if (!fields.includes(FieldTypes.actorName)) {
		throw new Error('Search: actor fields not provided');
	}

	if (!searchForRelatedItems) {
		return await actorManager.findMany({
			app,
			searchQuery: {
				actor_name: term,
			},
			transaction,
		});
	}

	const actors = await actorManager.findMany({
		app,
		searchQuery: {
			character_ids: characterIds,
		},
		transaction,
	});

	const actorIds = actors.map((a) => a.id);

	const seasons = await seasonManager.findMany({
		app,
		searchQuery: {
			actor_ids: actorIds,
		},
		transaction,
	});

	return actors.map((actor) => {
		const actorSeasons = seasons.filter((season) => season.actor_id === actor.id);
		const seasonsActive = actorSeasons.map((s) => s.count);

		return {
			...actor,
			seasonsActive,
		};
	});
}

async function getRelationship({
	app,
	searchForRelatedItems = false,
	characterIds = [],
	transaction,
}: {
	app: FastifyInstance;
	searchForRelatedItems: boolean;
	characterIds?: number[];
	transaction?: Knex.Transaction;
}): Promise<RelationshipsExtended[] | []> {
	if (!searchForRelatedItems || _.isEmpty(characterIds)) {
		return [];
	}
	const relationships = await relationshipsManager.findMany({
		app,
		searchQuery: {
			character_ids: characterIds,
		},
		transaction,
	});

	const relationshipsRelationToIds = relationships
		.filter((c) => c.relation_to !== null)
		.map((c) => c.relation_to) as number[];

	if (_.isEmpty(relationshipsRelationToIds)) {
		return [];
	}

	const relationshipsCharacters = await characterManager.findMany({
		app,
		searchQuery: {
			character_ids: relationshipsRelationToIds,
		},
		transaction,
	});

	const characterMap = _.keyBy(relationshipsCharacters, 'id');
	const aggregated = relationships
		.filter((r) => r.relation_to !== null)
		.map((r) => ({
			character_id: r.character_id,
			type: r.type,
			name: characterMap[r.relation_to as number].name,
		}));

	return aggregated;
}

async function getActions({
	app,
	searchForRelatedItems = false,
	characterIds = [],
	transaction,
}: {
	app: FastifyInstance;
	searchForRelatedItems: boolean;
	characterIds?: number[];
	transaction?: Knex.Transaction;
}): Promise<ActionsExtended[] | []> {
	if (!searchForRelatedItems || _.isEmpty(characterIds)) {
		return [];
	}
	const actions = await actionManager.findMany({
		app,
		searchQuery: {
			character_ids: characterIds,
		},
		transaction,
	});

	const actonToIds = actions
		.filter((c) => c.action_to !== null)
		.map((c) => c.action_to) as number[];

	const actonCharacters = !_.isEmpty(actonToIds)
		? await characterManager.findMany({
				app,
				searchQuery: {
					character_ids: actonToIds,
				},
				transaction,
			})
		: [];

	const characterMap = _.keyBy(actonCharacters, 'id');
	const aggregated = actions
		.filter((action) => action.action_to !== null)
		.map((action) => ({
			character_id: action.character_id,
			type: action.type,
			name: characterMap[action.action_to as number].name,
		}));

	return aggregated;
}

async function getAllies({
	app,
	searchForRelatedItems = false,
	characterIds = [],
	transaction,
}: {
	app: FastifyInstance;
	searchForRelatedItems: boolean;
	characterIds?: number[];
	transaction?: Knex.Transaction;
}): Promise<AlliesExtended[] | []> {
	if (!searchForRelatedItems || _.isEmpty(characterIds)) {
		return [];
	}
	const allies = await allyManager.findMany({
		app,
		searchQuery: {
			character_ids: characterIds,
		},
		transaction,
	});

	const allyToIds = allies.filter((c) => c.ally_to !== null).map((c) => c.ally_to) as number[];

	const allyCharacters = !_.isEmpty(allyToIds)
		? await characterManager.findMany({
				app,
				searchQuery: {
					character_ids: allyToIds,
				},
				transaction,
			})
		: [];

	const alliesMap = _.keyBy(allies, 'ally_to');

	const alliesExtended = allyCharacters.reduce(
		(extended, relation) => {
			const matchingData = alliesMap[relation.id];

			if (matchingData && !extended[matchingData.id]) {
				extended[matchingData.id] = {
					character_ids: matchingData.character_id,
					name: relation.name,
				};
			}

			return extended;
		},
		{} as Record<number, any>,
	);

	const characterMap = _.keyBy(allyCharacters, 'id');
	const aggregated = allies
		.filter((ally) => ally.ally_to !== null)
		.map((ally) => ({
			character_id: ally.character_id,
			name: characterMap[ally.ally_to as number].name,
		}));

	return aggregated;
}

async function getHouses({
	app,
	searchForRelatedItems = false,
	characterIds = [],
	transaction,
}: {
	app: FastifyInstance;
	searchForRelatedItems: boolean;
	characterIds?: number[];
	transaction?: Knex.Transaction;
}): Promise<House[] | []> {
	if (!searchForRelatedItems || _.isEmpty(characterIds)) {
		return [];
	}

	return await houseManager.findMany({
		app,
		searchQuery: {
			character_ids: characterIds,
		},
		transaction,
	});
}
