import { FastifyInstance } from 'fastify';
import * as characters from './public';

export default async function registerPublicRoutes(app: FastifyInstance) {
	app.route(characters.getCharacter);
	app.route(characters.createCharacter);
	app.route(characters.updateCharacter);
	app.route(characters.deleteCharacter);
	app.route(characters.searchCharacter);

	app.route(characters.createCharacterActor);
	app.route(characters.getCharacterActor);
	app.route(characters.deleteCharacterActor);

	app.route(characters.createCharacterHouse);
	app.route(characters.deleteCharacterHouse);
}
