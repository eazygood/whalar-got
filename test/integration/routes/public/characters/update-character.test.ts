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
import _ from 'lodash';

let mysqlContainer: StartedMySqlContainer;
let app: FastifyInstance;

jest.setTimeout(100000);

describe('PUT /characters/:character_id', () => {
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

	it('should update a character successfully', async () => {
		const characterId = 1;
		const updatedCharacterData = {
			name: 'updated test 1',
			nickname: 'updated testor',
			kingsguard: true,
			royal: true,
			image_full: 'updated_image_full.jpg',
			image_thumb: 'updated_image_thumb.jpg',
			link: 'https://example.com/updated',
		};

		const response = await request(app.server)
			.put(`/characters/${characterId}`)
			.send(updatedCharacterData)
			.expect(200);

		expect(response.body).toEqual({ success: true });

		const updatedCharacter = await characterManager.findOne({ app, characterId });
		expect(_.omit(updatedCharacter, 'id')).toEqual({
			...updatedCharacterData,
			kingsguard: Number(updatedCharacterData.kingsguard),
			royal: Number(updatedCharacterData.kingsguard),
		});
	});

	it('should return 404 if character does not exist', async () => {
		const nonExistentCharacterId = 99999999;

		await request(app.server)
			.put(`/characters/${nonExistentCharacterId}`)
			.send({
				name: 'updated test',
				nickname: 'updated testor',
				kingsguard: true,
				royal: true,
				image_full: 'updated_image_full.jpg',
				image_thumb: 'updated_image_thumb.jpg',
				link: 'https://example.com/updated',
			})
			.expect(404);
	});

	it('should return 400 if invalid data is provided', async () => {
		const characterId = 1;
		const invalidCharacterData = {
			name: 'updated test',
			nickname: 'updated testor',
			kingsguard: 'invalid_value', // Invalid value for kingsguard
			royal: true,
			image_full: 'updated_image_full.jpg',
			image_thumb: 'updated_image_thumb.jpg',
			link: 'https://example.com/updated',
		};

		await request(app.server)
			.put(`/characters/${characterId}`)
			.send(invalidCharacterData)
			.expect(400);
	});
});
