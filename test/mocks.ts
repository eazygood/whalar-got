import fp from 'fastify-plugin';

const mockKnexInstance = {
	select: jest.fn().mockReturnThis(),
	from: jest.fn().mockReturnThis(),
	raw: jest.fn().mockReturnThis(),
	first: jest.fn().mockReturnThis(),
	where: jest.fn().mockReturnThis(),
	table: jest.fn().mockReturnThis(),
	transaction: () => ({
		commit: jest.fn().mockReturnThis(),
		rollback: jest.fn().mockReturnThis(),
	}),
	migrate: {
		latest: jest.fn().mockReturnThis(),
	},
	seed: jest.fn().mockReturnThis(),
	then: jest.fn().mockImplementation((callback: (rows: any[]) => void) => {
		console.log('Mock Knex: then called');
		callback([{ id: 1, name: 'John Doe' }]);
		return Promise.resolve();
	}),
};

export const knexPlugin = fp(async (fastify: any, options: any) => {
	fastify.decorate('knex', mockKnexInstance);
});

export const characterRepostory = {
	findOne: jest.fn().mockReturnThis(),
	findMany: jest.fn().mockReturnThis(),
	createOne: jest.fn().mockReturnThis(),
	updateOne: jest.fn().mockReturnThis(),
	deleteOne: jest.fn().mockReturnThis(),
};

export const rabbitmqMock = {
	default: jest.fn().mockImplementation((instance, opts, next) => {
		// Mock rabbitmq object on the fastify instance
		instance.decorate('rabbitmq', {
			createChannel: jest.fn().mockResolvedValue({
				assertQueue: jest.fn().mockResolvedValue(true),
				sendToQueue: jest.fn().mockImplementation((queue, message) => {}),
			}),
		});
		next();
	}),
};

