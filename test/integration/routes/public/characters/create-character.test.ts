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
describe('POST /characters/', () => {
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
		// rabbitmqContainer = await startRabbitMqContainer();
		app = await startTestEnv();

		for (const character of mockCharacterArray) {
			characterManager.createOne({ app, createData: character });
		}
	});

	afterAll(async () => {
		await stopMysqlDbContainer(mysqlContainer);
		// await stopRabbitMqContainer(rabbitmqContainer);
		await stopTestEnv(app);
	});

	it('should create a new character with valid data', async () => {
		const newCharacter = {
			name: 'John Snow',
			nickname: 'The Bastard',
			royal: false,
			kingsguard: false,
			link: null,
			image_full: null,
			image_thumb: null,
		};

		const response = await request(app.server)
			.post('/characters')
			.send(newCharacter)
			.expect(200)
			.expect('Content-Type', 'application/json; charset=utf-8');

		expect(response.body.data).toHaveProperty('id');
		expect(response.body.data.name).toBe(newCharacter.name);
		expect(response.body.data.nickname).toBe(newCharacter.nickname);
	});

	it('should return 400 if required fields are missing', async () => {
		const invalidCharacter = {
			nickname: 'Test',
			royal: false,
			kingsguard: false,
			link: null,
			image_full: null,
			image_thumb: null,
		};

		const response = await request(app.server)
			.post('/characters')
			.send(invalidCharacter)
			.expect(400)
			.expect('Content-Type', 'application/json; charset=utf-8');

		expect(response.body.data).toBeNull();
		expect(response.body.error).toBe(`data should have required property 'name'`);
	});

	it('should return 400 if invalid data types are provided', async () => {
		const invalidCharacter = {
			name: 123,
			nickname: 'The Imp',
			royal: 'false',
			kingsguard: false,
			link: null,
			image_full: null,
			image_thumb: null,
		};

		const response = await request(app.server)
			.post('/characters')
			.send(invalidCharacter)
			.expect(400)
			.expect('Content-Type', 'application/json; charset=utf-8');

		expect(response.body.error).toBe('data.name should be string');
	});
});
