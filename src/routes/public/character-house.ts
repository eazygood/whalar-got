import { Route } from '../schemas/route';
import { characterHouseSchemas } from '../schemas';

export const createCharacterHouse: Route<{
	Reply: characterHouseSchemas.CreateOneCharacterHouseReply;
	Params: characterHouseSchemas.CreateOneCharacterHouseParams;
}> = {
	method: 'POST',
	url: '/:character_id/houses/:house_name',
	schema: {
		response: {
			200: characterHouseSchemas.CreateOneCharacterHouseReply,
		},
	},
	async handler(request, reply) {
		// return reply.status(200).send({ data: {}} );
	},
};

export const deleteCharacterHouse: Route<{
	Reply: characterHouseSchemas.DeleteOneCharacterHouseReply;
	Params: characterHouseSchemas.DeleteOneCharacterHouseParam;
}> = {
	method: 'DELETE',
	url: '/:character_id/houses/:house_name',
	schema: {
		response: {
			200: characterHouseSchemas.DeleteOneCharacterHouseReply,
		},
	},
	async handler(request, reply) {
		// return reply.status(200).send({ data: {}} );
	},
};
