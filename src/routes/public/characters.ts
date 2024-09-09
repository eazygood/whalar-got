import { Route } from '../schemas/route';
import _ from 'lodash';
import * as publicApiSchemas from '../schemas';
import * as characterManager from '../../managers/character-manager';
import * as characterSchemas from '../schemas/characters-schemas';
import { withinTransaction } from '../../connectors/mysql-connector';

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

export const getCharacterById: Route<{
	Reply: characterSchemas.FindOneCharactersReply;
	Params: characterSchemas.FindOneCharactersParam;
}> = {
	method: 'GET',
	url: '/:character_id',
	schema: {
		querystring: publicApiSchemas.SearchQuerystring,
		response: {
			200: publicApiSchemas.SearchCharactersReply,
		},
	},
	async handler(request, reply) {
		const character = await characterManager.findOne({
			app: request.server,
			characterId: request.params.character_id,
		});

		return reply.status(200).send({ data: character });
	},
};

export const updateCharacterById: Route<{
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

export const deleteCharacterById: Route<{
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
					characterId: request.params.character_id,
					transaction,
				});
			},
		});

		return reply.status(200).send({ id });
	},
};
