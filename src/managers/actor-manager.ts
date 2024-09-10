import { FastifyInstance } from 'fastify';
import * as actorRepository from '../repositories/actor-repository';
import { SearchActorQuerystring, SearchCharactersQuerystring } from '../routes/schemas';

export async function search({
	app,
	searchQuery,
}: {
	app: FastifyInstance;
	searchQuery: SearchActorQuerystring;
}) {
	return await actorRepository.findMany({ app, searchQuery });
}
