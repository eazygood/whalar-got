import { FastifyInstance } from 'fastify';
import {
	SearchActionsQuerystring,
	SearchActorQuerystring,
	SearchAllyQuerystring,
	SearchCharactersQuerystring,
	SearchHouseQuerystring,
	SearchQuerystring,
	SearchRelationshipsQuerystring,
} from '../routes/schemas';
import * as characterManager from '../managers/character-manager';
import * as actorManager from '../managers/actor-manager';
import { request } from 'http';
import _ from 'lodash';

export async function getDetails({
	app,
	searchQuery,
}: {
	app: FastifyInstance;
	searchQuery: SearchQuerystring;
}) {
	console.log(Object.keys(SearchCharactersQuerystring));
	const characterSearchQuery: SearchCharactersQuerystring = searchQuery;
	const actorsSearchQuery: SearchActorQuerystring = searchQuery;
	const houseSearchQuery: SearchHouseQuerystring = searchQuery;
	const relationshipsSearchQuery: SearchRelationshipsQuerystring = searchQuery;
	const actoinsSearchQuery: SearchActionsQuerystring = searchQuery;
	const allySearchQuery: SearchAllyQuerystring = searchQuery;

	const characters = await characterManager.search({ app, searchQuery: characterSearchQuery });
	const actors = await actorManager.search({ app, searchQuery: actorsSearchQuery });

	// search actors + seasons
	// search house
	// search relationships
	// search actions
	// search allies

	return characters;
}
