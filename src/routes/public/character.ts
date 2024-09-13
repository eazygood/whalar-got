import { Route } from '../schemas/route';
import Ajv from 'ajv';
import _ from 'lodash';
import * as characterManager from '../../managers/character-manager';
import * as characterSchemas from '../schemas/character-schemas';
import { withinTransaction } from '../../connectors/mysql-connector';
import { characterSearchSchemas } from '../schemas';
import { characterDetailsMediator } from '../../mediators';
import { CREATE_CHARACTERS_QUEUE_RABBITMQ } from '../../message-queues/constants';
import { eventManager } from '../../managers';
import { GeneralResponse } from '../schemas/general-schema';
import { parseBoolean } from '../../tools/querystring';

const ajv = new Ajv();

export const createCharacter: Route<{
	Reply: characterSchemas.CreateOneCharactersReply;
	Body: characterSchemas.CreateOneCharactersBody;
}> = {
	method: 'POST',
	url: '/',
	schema: {
		response: {
			200: characterSchemas.CreateOneCharactersReply,
			400: characterSchemas.CreateOneCharactersReply,
		},
		description: 'Add character',
		tags: ['character'],
	},
	async handler(request, reply) {
		if (!ajv.validate(characterSchemas.CreateOneCharactersBody, request.body)) {
			return reply.status(400).send({ data: null, success: false, error: ajv.errorsText() });
		}

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

		if (process.env.PRODUCE_TO_QUEUE) {
			await eventManager.publishOneCreate({
				app: request.server,
				queue: CREATE_CHARACTERS_QUEUE_RABBITMQ,
				body: request.body,
			});
		}

		return reply.status(200).send({ data: created, success: true });
	},
};

export const getCharacter: Route<{
	Reply: characterSchemas.FindOneCharacterReply;
	Params: characterSchemas.FindOneCharactersParam;
}> = {
	method: 'GET',
	url: '/:character_id',
	schema: {
		response: {
			200: characterSchemas.FindOneCharacterReply,
			400: characterSchemas.FindOneCharacterReply,
			404: characterSchemas.FindOneCharacterReply,
		},
		description: 'Fetch character by ID',
		tags: ['character'],
	},
	async handler(request, reply) {
		if (!ajv.validate(characterSchemas.FindOneCharactersParam, request.params)) {
			return reply.status(400).send({ data: null, success: false, error: ajv.errorsText() });
		}

		if (isNaN(Number(request.params.character_id))) {
			return reply
				.status(400)
				.send({ data: null, success: false, error: 'character_id must be a number' });
		}

		const character = await characterManager.findOne({
			app: request.server,
			characterId: Number(request.params.character_id),
		});

		if (!character) {
			return reply.status(404).send({ data: null, success: false });
		}

		return reply.status(200).send({ data: character, success: true });
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
			404: characterSchemas.UpdateOneCharactersReply,
		},
		description: 'Update character by ID',
		tags: ['character'],
	},
	async handler(request, reply) {
		const paramValidation = ajv.validate(
			characterSchemas.UpdateOneCharactersParam,
			request.params,
		);
		const bodyValidation = ajv.validate(characterSchemas.UpdateOneCharactersBody, request.body);

		if (!paramValidation || !bodyValidation) {
			return reply.status(400).send({ success: false, error: ajv.errorsText() });
		}

		const data = await withinTransaction({
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

		if (process.env.PRODUCE_TO_QUEUE) {
			await eventManager.publishOneUpdate({
				app: request.server,
				queue: CREATE_CHARACTERS_QUEUE_RABBITMQ,
				body: request.body,
			});
		}

		const isUpdated = Boolean(data);

		if (!isUpdated) {
			return reply.status(404).send({ success: isUpdated, error: 'character not found' });
		}

		return reply.status(200).send({ success: isUpdated });
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
			400: characterSchemas.DeleteOneCharacterReply,
			404: characterSchemas.DeleteOneCharacterReply,
		},
		description: 'Delete character by ID',
		tags: ['character'],
	},
	async handler(request, reply) {
		if (!ajv.validate(characterSchemas.DeleteOneCharacterParam, request.params)) {
			return reply.status(400).send({ success: false, error: ajv.errorsText() });
		}

		if (isNaN(Number(request.params.character_id))) {
			return reply
				.status(400)
				.send({ success: false, error: 'character_id must be a number' });
		}

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

		if (!id) {
			return reply.status(404).send({ success: false });
		}

		return reply.status(200).send({ success: Boolean(id) });
	},
};

export const searchCharacter: Route<{
	Reply: characterSearchSchemas.GeneralSearchCharactersReply;
	Querystring: characterSearchSchemas.SearchItemsQueryString;
}> = {
	method: 'GET',
	url: '/search',
	schema: {
		response: {
			200: characterSearchSchemas.GeneralSearchCharactersReply,
			400: characterSearchSchemas.GeneralSearchCharactersReply
		},
		description: 'Search character by ID',
		tags: ['character'],
	},
	async handler(request, reply) {
		const { searchForRelatedItems } = request.query;
		
		if (typeof searchForRelatedItems === 'string') {
			request.query.searchForRelatedItems = parseBoolean(searchForRelatedItems);
		}

		if (!ajv.validate(characterSearchSchemas.SearchItemsQueryString, request.query)) {
			return reply.status(400).send({ data: null, success: false, error: ajv.errorsText() });
		}

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

		return reply.status(200).send({ data, success: true });
	},
};
