import { Route } from '../schemas/route';
import { characterActorSchemas, characterHouseSchemas } from '../schemas';

export const createCharacterActor: Route<{
	Reply: characterActorSchemas.CreateOneCharacterActorReply;
	Params: characterActorSchemas.CreateOneCharacterActorParams;
}> = {
	method: 'POST',
	url: '/:character_id/actor/:actor_id',
	schema: {
		response: {
			200: characterActorSchemas.CreateOneCharacterActorReply,
		},
	},
	async handler(request, reply) {
		// return reply.status(200).send({ data: {}} );
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
		// return reply.status(200).send({ data: {}} );
	},
};