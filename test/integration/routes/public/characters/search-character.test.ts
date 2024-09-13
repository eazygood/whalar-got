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

describe('POST /characters/:character_id', () => {
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

	it('add test', () => {
		expect(true).toBe(true);
	})
});
