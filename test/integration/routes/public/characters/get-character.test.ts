import { StartedMySqlContainer } from '@testcontainers/mysql';
import {
	startMysqlDbContainer,
	startRabbitMqContainer,
	startTestEnv,
	stopMysqlDbContainer,
	stopRabbitMqContainer,
	stopTestEnv,
} from '../../../../environment';
import request from 'supertest';
import { FastifyInstance } from 'fastify/types/instance';
import { characterManager } from '../../../../../src/managers';
import { CreateOneCharactersBody } from '../../../../../src/routes/schemas/character-schemas';
import { StartedRabbitMQContainer } from '@testcontainers/rabbitmq';

let mysqlContainer: StartedMySqlContainer;
let rabbitmqContainer: StartedRabbitMQContainer;
let app: FastifyInstance;

jest.setTimeout(100000);

describe('GET /characters/:character_id', () => {
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
	it('should get response status 200', async () => {
		await request(app.server)
			.get('/characters/1')
			.expect(200)
			.expect('Content-Type', 'application/json; charset=utf-8');
	});

	it('should get character by id 1', async () => {
		const data = await request(app.server).get('/characters/1');

		expect(data.body?.data).toEqual({
			id: 1,
			name: 'test 1',
			nickname: 'testor',
			royal: 0,
			kingsguard: 0,
			link: null,
			image_full: null,
			image_thumb: null,
		});
	});

	it('should get status code 400 if character_id is not a number', async () => {
		await request(app.server)
			.get('/characters/invalid')
			.expect(400)
			.expect('Content-Type', 'application/json; charset=utf-8');
	});

	it('should get status code 404 if character not found', async () => {
		await request(app.server)
			.get('/characters/999999')
			.expect(404)
			.expect('Content-Type', 'application/json; charset=utf-8');
	});
});
