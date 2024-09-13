import { getKnexPluginMock, startTestEnv, stopTestEnv } from '../../environment';
import { FastifyInstance } from 'fastify';

import { characterRepostory, knexPlugin, rabbitmqMock } from '../../mocks';

let app: FastifyInstance;

jest.mock('../../../src/plugins/knex-plugin', () => {
	return knexPlugin;
});

jest.mock('../../../src/repositories/character-repository', () => characterRepostory);

jest.mock('fastify-amqp', () => rabbitmqMock);

beforeAll(async () => {
	app = await startTestEnv();
});

beforeEach(async () => {
	jest.resetAllMocks();
});

afterAll(async () => {
	await stopTestEnv(app);
});

describe('endpoints /characters/ calls', () => {
	describe('GET /characters/', () => {
		it('should response with character data', async () => {
			const createResponseData = {
				id: 1,
				name: 'Testor',
				nickname: null,
				royal: false,
				kingsguard: false,
				link: '/character/ch0540870/',
				image_full: null,
				image_thumb: null,
			};

			characterRepostory.findOne = jest.fn().mockReturnValue(createResponseData) as any;

			const character = await app.inject({
				method: 'GET',
				url: '/characters/1',
			});

			expect(character.statusCode).toBe(200);
			expect(JSON.parse(character.body)).toEqual({
				data: createResponseData,
				success: true,
			});
		});

		it('should respond with 404 if character is not found', async () => {
			characterRepostory.findOne = jest.fn().mockReturnValue(null) as any;

			const character = await app.inject({
				method: 'GET',
				url: '/characters/2',
			});

			expect(character.statusCode).toBe(404);
			expect(JSON.parse(character.body)).toEqual({
				data: null,
				success: false,
			});
		});

		it('should respond with 500 if an error occurs', async () => {
			characterRepostory.findOne = jest.fn().mockImplementation(() => {
				throw new Error('Internal Server Error');
			}) as any;

			const character = await app.inject({
				method: 'GET',
				url: '/characters/1',
			});

			expect(character.statusCode).toBe(500);
			expect(JSON.parse(character.body)).toEqual({
				error: 'Internal Server Error',
				message: 'Internal Server Error',
				statusCode: 500,
			});
		});
	});

	describe('POST /characters/', () => {
		it('should create a new character', async () => {
			const newCharacter = {
				name: 'New Character',
				nickname: 'The New One',
				royal: true,
				kingsguard: false,
				link: '/character/ch0540870/',
				image_full: null,
				image_thumb: null,
			};

			characterRepostory.createOne = jest
				.fn()
				.mockReturnValue({ id: 1, ...newCharacter }) as any;
			characterRepostory.findOne = jest
				.fn()
				.mockReturnValue({ id: 1, ...newCharacter }) as any;

			const response = await app.inject({
				method: 'POST',
				url: '/characters',
				payload: newCharacter,
			});

			expect(response.statusCode).toBe(200);
			expect(JSON.parse(response.body)).toEqual({
				data: { id: 1, ...newCharacter },
				success: true,
			});
		});

		it('should respond with 400 if required fields are missing', async () => {
			const invalidCharacter = {
				name: 'Invalid Character',
				kingsguard: false,
			};

			const response = await app.inject({
				method: 'POST',
				url: '/characters',
				payload: invalidCharacter,
			});

			expect(response.statusCode).toBe(400);
			expect(JSON.parse(response.body)).toEqual({
				data: null,
				success: false,
				error: "data should have required property 'nickname'",
			});
		});
	});

	describe('PUT /characters/:id', () => {
		it('should update an existing character', async () => {
			const updatedCharacter = {
				id: 1,
				name: 'Updated Character',
				nickname: 'The Updated One',
				royal: true,
				kingsguard: false,
				link: '/character/ch0540870/',
				image_full: null,
				image_thumb: null,
			};

			characterRepostory.updateOne = jest.fn().mockReturnValue(updatedCharacter) as any;

			const response = await app.inject({
				method: 'PUT',
				url: '/characters/1',
				payload: updatedCharacter,
			});

			expect(response.statusCode).toBe(200);
			expect(JSON.parse(response.body)).toEqual({
				success: true,
			});
		});

		it('should respond with 404 if character is not found', async () => {
			characterRepostory.updateOne = jest.fn().mockReturnValue(null) as any;

			const response = await app.inject({
				method: 'PUT',
				url: '/characters/2',
				payload: {
					name: 'Updated Character',
				},
			});

			expect(response.statusCode).toBe(404);
			expect(JSON.parse(response.body)).toEqual({
				success: false,
				error: 'character not found',
			});
		});
	});

	describe('DELETE /characters/:id', () => {
		it('should delete an existing character', async () => {
			characterRepostory.deleteOne = jest.fn().mockReturnValue(true) as any;

			const response = await app.inject({
				method: 'DELETE',
				url: '/characters/1',
			});

			expect(response.statusCode).toBe(200);
			expect(JSON.parse(response.body)).toEqual({
				success: true,
			});
		});

		it('should respond with 404 if character is not found', async () => {
			characterRepostory.deleteOne = jest.fn().mockReturnValue(null) as any;

			const response = await app.inject({
				method: 'DELETE',
				url: '/characters/2',
			});

			expect(response.statusCode).toBe(404);
			expect(JSON.parse(response.body)).toEqual({
				success: false,
			});
		});
	});
});
