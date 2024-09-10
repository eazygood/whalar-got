import { FastifyInstance } from 'fastify';
import * as characters from './public';

export default async function registerPublicRoutes(app: FastifyInstance) {
	app.route(characters.getCharacterById);
	app.route(characters.updateCharacterById);
	app.route(characters.deleteCharacterById);

	app.route(characters.createCharacterActor);
	app.route(characters.deleteCharacterActor);

	app.route(characters.createCharacterHouse);
	app.route(characters.deleteCharacterHouse);
}
