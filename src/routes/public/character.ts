import { Route } from '../schemas/route';
import _ from 'lodash';
import * as characterManager from '../../managers/character-manager';
import * as characterSchemas from '../schemas/character-schemas';
import { withinTransaction } from '../../connectors/mysql-connector';
import { characterSearchSchemas } from '../schemas';
import { characterDetailsMediator } from '../../mediators';

export const createCharacter: Route<{
	Reply: characterSchemas.CreateOneCharactersReply;
	Body: characterSchemas.CreateOneCharactersBody;
}> = {
	method: 'POST',
	url: '/',
	schema: {
		response: {
			200: characterSchemas.CreateOneCharactersReply,
		},
	},
	async handler(request, reply) {
		const created = await withinTransaction({
			app: request.server,
			callback: async (transaction) => {
				return characterManager.createOne({
					app: request.server,
					createData: request.body,
					transaction,
				});
			},
		});

		return reply.status(200).send({ data: created });
	},
};

export const getCharacter: Route<{
	Reply: characterSchemas.FindOneCharactersReply;
	Params: characterSchemas.FindOneCharactersParam;
}> = {
	method: 'GET',
	url: '/:character_id',
	schema: {
		response: {
			200: characterSchemas.FindOneCharactersReply,
		},
	},
	async handler(request, reply) {
		const character =
			(await characterManager.findOne({
				app: request.server,
				characterId: Number(request.params.character_id),
			})) ?? null;

		return reply.status(200).send({ data: character });
	},
};

export const updateCharacter: Route<{
	Reply: characterSchemas.UpdateOneCharactersReply;
	Params: characterSchemas.UpdateOneCharactersParam;
	Body: characterSchemas.UpdateOneCharactersBody;
}> = {
	method: 'PUT',
	url: '/:character_id',
	schema: {
		params: characterSchemas.UpdateOneCharactersParam,
		body: characterSchemas.UpdateOneCharactersBody,
		response: {
			200: characterSchemas.UpdateOneCharactersReply,
		},
	},
	async handler(request, reply) {
		await withinTransaction({
			app: request.server,
			callback: async (transaction) => {
				return characterManager.updateOne({
					app: request.server,
					characterId: request.params.character_id,
					updateData: request.body,
					transaction,
				});
			},
		});

		return reply.status(200).send();
	},
};

export const deleteCharacter: Route<{
	Reply: characterSchemas.DeleteOneCharacterReply;
	Params: characterSchemas.DeleteOneCharacterParam;
}> = {
	method: 'DELETE',
	url: '/:character_id',
	schema: {
		response: {
			200: characterSchemas.DeleteOneCharacterReply,
		},
	},
	async handler(request, reply) {
		const id = await withinTransaction({
			app: request.server,
			callback: async (transaction) => {
				return characterManager.deleteOne({
					app: request.server,
					characterId: Number(request.params.character_id),
					transaction,
				});
			},
		});

		return reply.status(200).send({ id });
	},
};

export const searchCharacter: Route<{
	Reply: characterSearchSchemas.SearchCharactersReply;
	Querystring: characterSearchSchemas.SearchItemsQueryString;
}> = {
	method: 'GET',
	url: '/search',
	schema: {
		response: {
			200: characterSearchSchemas.SearchCharactersReply,
		},
	},
	async handler(request, reply) {
		const data = await withinTransaction({
			app: request.server,
			callback: async (transaction) => {
				return characterDetailsMediator.findMany({
					app: request.server,
					searchQuery: request.query,
					transaction,
				});
			},
		});

		return reply.status(200).send({ data });
	},
};
