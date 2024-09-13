export const swaggerConfig = {
	openapi: {
		openapi: '3.0.0',
		info: {
			title: 'RESTful Whalar Game of Thrones APIs',
			description: 'Game of Thrones CRUD',
			version: '0.0.1',
		},
		consumes: ['application/json'],
		produces: ['application/json'],
		externalDocs: {
			url: 'https://swagger.io',
			description: 'Find more info here',
		},
		tags: [
			{ name: 'character', description: 'GoT characters related endpoints' },
			{ name: 'actor', description: 'GoT actors related endpoints' },
			{ name: 'house', description: 'GoT house related endpoints' },
		],
	},
};
