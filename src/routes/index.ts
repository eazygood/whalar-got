import { FastifyInstance } from "fastify";
import * as characters from './public/characters';

export default async function registerPublicRoutes(app: FastifyInstance) {
    app.route(characters.getCharacterById);
    app.route(characters.updateCharacterById);
    app.route(characters.deleteCharacterById);
}