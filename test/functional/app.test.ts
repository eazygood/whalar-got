import { FastifyInstance } from 'fastify/types/instance';
import { startTestEnv, stopTestEnv } from '../environment';
import fp from 'fastify-plugin';

let knexMock = getDefaultKnexPluginParams();

export function getDefaultKnexPluginParams() {
	return {
		raw: jest.fn(),
		destroy: jest.fn(),
		migrate: {
			latest: jest.fn(),
		},
		seed: {
			run: jest.fn(),
		},
	};
}

const knexPlugin = fp(async (fastify: any, options: any) => {
	fastify.decorate('knex', knexMock);
});

jest.mock('../../src/plugins/knex-plugin', () => {
	return knexPlugin;
});

let app: FastifyInstance;
beforeAll(async () => {
	app = await startTestEnv();
});

afterAll(async () => {
	await stopTestEnv(app);
});

describe('app initialization test', () => {
	it('should app register all mocked dependecies', async () => {
		expect(true).toBe(true);
	});
});
