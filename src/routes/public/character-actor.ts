import { Route } from '../schemas/route';
import { characterActorSchemas, characterHouseSchemas } from '../schemas';
import { withinTransaction } from '../../connectors/mysql-connector';
import { actorManager, characterManager } from '../../managers';

export const createCharacterActor: Route<{
	Reply: characterActorSchemas.CreateOneCharacterActorReply;
	Params: characterActorSchemas.CreateOneCharacterActorParams;
	Body: characterActorSchemas.CreateOneCharacterActorBody;
}> = {
	method: 'POST',
	url: '/:character_id/actors',
	schema: {
		response: {
			200: characterActorSchemas.CreateOneCharacterActorReply,
		},
	},
	async handler(request, reply) {
		const created = await withinTransaction({
			app: request.server,
			callback: async (transaction) => {
				return actorManager.createOne({
					app: request.server,
					characterId: request.params.character_id,
					createData: request.body,
					transaction,
				});
			},
		});

		return reply.status(200).send({ data: created });
	},
};

export const getCharacterActor: Route<{
	Reply: characterActorSchemas.FindOneCharactersActorReply;
	Params: characterActorSchemas.FindOneCharactersActorParam;
}> = {
	method: 'GET',
	url: '/:character_id/actors/:actor_id',
	schema: {
		response: {
			200: characterActorSchemas.FindOneCharactersActorReply,
		},
	},
	async handler(request, reply) {
		const actor =
			(await actorManager.findOne({
				app: request.server,
				actorId: Number(request.params.actor_id),
				characterId: Number(request.params.character_id),
			})) ?? null;

		return reply.status(200).send({ data: actor });
	},
};

export const deleteCharacterActor: Route<{
	Reply: characterActorSchemas.DeleteOneCharacterActorReply;
	Params: characterActorSchemas.DeleteOneCharacterActorParam;
}> = {
	method: 'DELETE',
	url: '/:character_id/actors/:actor_id',
	schema: {
		response: {
			200: characterActorSchemas.DeleteOneCharacterActorReply,
		},
	},
	async handler(request, reply) {
		const id = await withinTransaction({
			app: request.server,
			callback: async (transaction) => {
				return actorManager.deleteOne({
					app: request.server,
					actorId: Number(request.params.actor_id),
					characterId: Number(request.params.character_id),
					transaction,
				});
			},
		});

		return reply.status(200).send({ id });
	},
};
