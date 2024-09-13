import { StartedMySqlContainer } from '@testcontainers/mysql';
import {
	startMysqlDbContainer,
	startTestEnv,
	stopMysqlDbContainer,
	stopTestEnv,
} from '../../../../environment';
import request from 'supertest';
import { FastifyInstance } from 'fastify/types/instance';
import { characterManager } from '../../../../../src/managers';
import { CreateOneCharactersBody } from '../../../../../src/routes/schemas/character-schemas';
import { StartedRabbitMQContainer } from '@testcontainers/rabbitmq';

let mysqlContainer: StartedMySqlContainer;
let app: FastifyInstance;

jest.setTimeout(100000);
describe('DELETE /characters/:character_id', () => {
	beforeAll(async () => {
		const mockCharacterArray: CreateOneCharactersBody[] = [
			{
				name: 'test 1',
				nickname: 'testor',
				kingsguard: false,
				royal: false,
				image_full: null,
				image_thumb: null,
				link: null,
			},
		];
		mysqlContainer = await startMysqlDbContainer();
		app = await startTestEnv();

		for (const character of mockCharacterArray) {
			characterManager.createOne({ app, createData: character });
		}
	});

	afterAll(async () => {
		await stopMysqlDbContainer(mysqlContainer);
		await stopTestEnv(app);
	});

	it('should delete a character by character_id', async () => {
		await request(app.server)
			.delete('/characters/1')
			.expect(200)
			.expect('Content-Type', 'application/json; charset=utf-8');
	});

	it('should return 404 if character_id does not exist', async () => {
		const characterId = 99999999;
		const response = await request(app.server).delete(`/characters/${characterId}`).expect(404);

		expect(response.body).toEqual({ success: false });
	});

	it('should return 400 if character_id is not a valid number', async () => {
		const characterId = 'invalid'; // Assuming character_id is not a valid number
		const response = await request(app.server).delete(`/characters/${characterId}`);

		expect(response.status).toBe(400);
	});
});
