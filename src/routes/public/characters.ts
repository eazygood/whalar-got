import { Route } from "../schemas/route";
import * as publicApiSchemas from '../schemas'
import * as characterManager from '../../managers/character-manager'



type FindManyCharactersRoute = {
	Reply: publicApiSchemas.FindManyCharactersReply;
};

export const findMany: Route<FindManyCharactersRoute> = {
    method: 'GET',
    url: '/characters',
    schema: {
        response: {
            200: publicApiSchemas.FindManyCharactersReply
        }
    }, 
    async handler(request, reply) {
        const characters = await characterManager.findMany({ app: request.server })
        return reply.status(200).send({ data: characters })
    }
}
