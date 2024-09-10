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


type ActorWithSeason = Actor & { season_active?: number[]; };

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
	const searchForRelatedItemsToUse = !!searchForRelatedItems;

	console.log('searchForRelatedItems ', searchForRelatedItemsToUse, searchForRelatedItems)

	console.log(entityTypesToUse);
	console.log(fieldsToUse);
	console.log(searchForRelatedItemsToUse);

	if (entityTypesToUse.includes('character')) {
		const { characters, characterIds } = await getCharacters({
			app,
			term,
			fields: fieldsToUse,
			transaction,
		});
		// const actors = !_.isEmpty(characterIds)
		// 	? await actorManager.findMany({
		// 			app,
		// 			searchQuery: {
		// 				character_ids: characterIds,
		// 			},
		// 			transaction,
		// 		})
		// 	: [];

		// const actorIds = actors.map((a) => a.id);

		// const seasons = !_.isEmpty(actorIds)
		// 	? await seasonManager.findMany({
		// 			app,
		// 			searchQuery: {
		// 				actor_ids: actorIds,
		// 			},
		// 			transaction,
		// 		})
		// 	: [];
		// const aggregatedActors = actors.map((actor) => {
		// 	const actorSeasons = seasons.filter((season) => season.actor_id === actor.id);

		// 	const seasonsActive = actorSeasons.map((s) => s.count);

		// 	return {
		// 		...actor,
		// 		seasonsActive,
		// 	};
		// });

		const { actors } = await getActors({ app, term, fields: fieldsToUse, searchForRelatedItems, characterIds, transaction})
		const houses = !_.isEmpty(characterIds)
			? await houseManager.findMany({
					app,
					searchQuery: {
						character_ids: characterIds,
					},
					transaction,
				})
			: [];
		const relationships = !_.isEmpty(characterIds)
			? await relationshipsManager.findMany({
					app,
					searchQuery: {
						character_ids: characterIds,
					},
					transaction,
				})
			: [];

		const relationshipsRelationToIds = relationships
			.filter((c) => c.relation_to !== null)
			.map((c) => c.relation_to) as number[];
		const relationshipsRelationTo = !_.isEmpty(relationshipsRelationToIds)
			? await characterManager.findMany({
					app,
					searchQuery: {
						character_ids: relationshipsRelationToIds,
					},
					transaction,
				})
			: [];

		const relationshipsRelationToMap = _.keyBy(relationships, 'relation_to');
		const relationshipsRelationToExtended = relationshipsRelationTo.reduce(
			(extended, relation) => {
				const matchingData = relationshipsRelationToMap[relation.id];

				if (matchingData && !extended[matchingData.id]) {
					extended[matchingData.id] = {
						character_id: matchingData.character_id,
						type: matchingData.type,
						name: relation.name,
					};
				}

				return extended;
			},
			{} as Record<number, any>,
		);

		const relationshipsRelationsValues = Object.values(relationshipsRelationToExtended);

		console.log('RELATED: ', relationshipsRelationTo);
		console.log(
			'RELATED extended: ',
			relationshipsRelationToExtended,
			relationshipsRelationToMap,
		);

		const actions = !_.isEmpty(characterIds)
			? await actionManager.findMany({
					app,
					searchQuery: {
						character_ids: characterIds,
					},
					transaction,
				})
			: [];
		const actionsActonToIds = actions
			.filter((c) => c.action_to !== null)
			.map((c) => c.action_to) as number[];
		const actionsActonToCharacters = !_.isEmpty(actionsActonToIds)
			? await characterManager.findMany({
					app,
					searchQuery: {
						character_ids: actionsActonToIds,
					},
					transaction,
				})
			: [];

		const actionsMap = _.keyBy(actions, 'action_to');
		const actionsExtended = actionsActonToCharacters.reduce(
			(extended, relation) => {
				const matchingData = actionsMap[relation.id];

				if (matchingData && !extended[matchingData.id]) {
					extended[matchingData.id] = {
						character_id: matchingData.character_id,
						type: matchingData.type,
						name: relation.name,
					};
				}

				return extended;
			},
			{} as Record<number, any>,
		);

		const actionsExtendedValues = Object.values(actionsExtended);

		console.log('RELATED: ', actionsActonToCharacters);
		console.log('RELATED extended: ', actionsExtendedValues, actionsMap);

		const allies = !_.isEmpty(characterIds)
			? await allyManager.findMany({
					app,
					searchQuery: {
						character_ids: characterIds,
					},
					transaction,
				})
			: [];

		const alliesAllyToIds = allies
			.filter((c) => c.ally_to !== null)
			.map((c) => c.ally_to) as number[];
		const alliesAllyToCharacters = !_.isEmpty(alliesAllyToIds)
			? await characterManager.findMany({
					app,
					searchQuery: {
						character_ids: alliesAllyToIds,
					},
					transaction,
				})
			: [];

		const alliesMap = _.keyBy(allies, 'ally_to');
		const alliesExtended = alliesAllyToCharacters.reduce(
			(extended, relation) => {
				const matchingData = alliesMap[relation.id];

				if (matchingData && !extended[matchingData.id]) {
					extended[matchingData.id] = {
						...matchingData,
						name: relation.name,
					};
				}

				return extended;
			},
			{} as Record<number, any>,
		);

		const alliesExtendedValues = Object.values(alliesExtended);

		const aggregatedData = characters.map((character) => {
			const characterActors = actors.filter(
				(actor) => actor.character_id === character.id,
			);
			const characterHouse = houses.find((house) => house.character_id === character.id);

			const relationships = relationshipsRelationsValues.filter(
				(r) => r.character_id === character.id,
			);
			const relationshipsMapped = _.mapValues(_.groupBy(relationships, 'type'), (items) =>
				items.map((item) => item.name),
			);

			const actions = actionsExtendedValues.filter((r) => r.character_id === character.id);
			const actionsMapped = _.mapValues(_.groupBy(actions, 'type'), (items) =>
				items.map((item) => item.name),
			);

			const alliesMapped = alliesExtendedValues
				.filter((r) => r.character_id === character.id)
				.map((a) => a.name);

			const multipleActors = characterActors.map((actor) => ({
				actorName: actor.name,
				actorLink: actor.link,
				seasonsActive: actor.season_active,
			}));

			const actorsData = {
				...(multipleActors.length > 1
					? { actors: multipleActors }
					: {
							...(!_.isEmpty(multipleActors)
								? {
										actorName: multipleActors[0].actorName,
										actorLink: multipleActors[0].actorLink,
									}
								: null),
						}),
			};

			const allies = !_.isEmpty(alliesMapped) ? { allies: alliesMapped } : null;

			// Merge
			return {
				characterName: character.name,
				...(characterHouse?.name ? { houseName: characterHouse?.name } : null),
				...(character.image_thumb ? { characterImageThumb: character.image_thumb } : null),
				...(character.image_full ? { characterImageFull: character.image_full } : null),
				...(character.link ? { characterLink: character.link } : null),
				...actorsData,
				...relationshipsMapped,
				...actionsMapped,
				...allies,
			};
		});

		// console.log('extended: ', Object.values(chartersExtended));
		console.log('extended: ', aggregatedData);
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
}) {
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
}): Promise<{ actors: ActorWithSeason[] }> {
	if (!fields.includes(FieldTypes.actorName)) {
		throw new Error('Search: actor fields not provided');
	}

	if (!searchForRelatedItems) {
		const actors = await actorManager.findMany({
			app,
			searchQuery: {
				actor_name: term,
			},
			transaction,
		});

		return {
			actors,
		};
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

	const actorsMapped = actors.map((actor) => {
		const actorSeasons = seasons.filter((season) => season.actor_id === actor.id);
		const seasonsActive = actorSeasons.map((s) => s.count);

		return {
			...actor,
			seasonsActive,
		};
	});

	return {
		actors: actorsMapped,
	};
}
