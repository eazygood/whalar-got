import { StartedMySqlContainer } from '@testcontainers/mysql';
import {
	startMysqlDbContainer,
	startTestEnv,
	stopMysqlDbContainer,
	stopTestEnv,
} from '../../../../environment';
import request from 'supertest';
import { FastifyInstance } from 'fastify/types/instance';
import { StartedRabbitMQContainer } from '@testcontainers/rabbitmq';
import * as mysqlSeeder from '../../../../../src/db/seeds/01_characters';

let mysqlContainer: StartedMySqlContainer;
let rabbitmqContainer: StartedRabbitMQContainer;
let app: FastifyInstance;

describe('POST /characters/:character_id', () => {
	beforeAll(async () => {
		mysqlContainer = await startMysqlDbContainer();
		app = await startTestEnv();

		// seed with original data from got-characters.json
		await mysqlSeeder.seed(app.knex);
	});

	afterAll(async () => {
		await stopMysqlDbContainer(mysqlContainer);
		// await stopRabbitMqContainer(rabbitmqContainer);
		await stopTestEnv(app);
	});

	it('should return matching characters when searching by term', async () => {
		const response = await request(app.server)
			.get('/characters/search')
			.query({ term: 'Jon Snow', entityTypes: 'character', searchForRelatedItems: true })
			.expect(200);

		expect(response.body).toEqual({
			success: true,
			data: {
				characters: [
					{
						characterName: 'Jon Snow',
						characterLink: '/character/ch0155777/',
						characterImageThumb:
							'https://images-na.ssl-images-amazon.com/images/M/MV5BMTkwMjUxMDk2OV5BMl5BanBnXkFtZTcwMzg3MTg4OQ@@._V1._SX100_SY140_.jpg',
						characterImageFull:
							'https://images-na.ssl-images-amazon.com/images/M/MV5BMTkwMjUxMDk2OV5BMl5BanBnXkFtZTcwMzg3MTg4OQ@@._V1_.jpg',
						houseName: ['Stark', 'Targaryen'],
						killed: [
							'Othor',
							'Qhorin Halfhand',
							'Orell',
							'Karl Tanner',
							'Styr',
							'Mance Rayder',
							'Janos Slynt',
							'White Walker',
							'Alliser Thorne',
							'Othell Yarwyck',
							'Bowen Marsh',
							'Olly',
							'Lyanna Stark',
							'Daenerys Targaryen',
						],
						killedBy: ['Alliser Thorne', 'Othell Yarwyck', 'Bowen Marsh', 'Olly'],
						guardedBy: ['Eddard Stark', 'Ghost'],
						parent: ['Rhaegar Targaryen', 'Lyanna Stark'],
						marriedEngaged: ['Ygritte'],
						actorName: 'Kit Harington',
						actorLink: '/name/nm3229685/',
					},
				],
			},
		});
	});

	it('should return empty array when no matching characters found', async () => {
		const response = await request(app.server)
			.get('/characters/search')
			.query({ term: 'Nobody knows', entityTypes: 'character', searchForRelatedItems: true })
			.expect(200);

		expect(response.body).toEqual({
			success: true,
			data: { characters: [] },
		});
	});

	it('should return character array without relations', async () => {
		const response = await request(app.server)
			.get('/characters/search')
			.query({ term: 'Aegon', entityTypes: 'character', searchForRelatedItems: false })
			.expect(200);

		expect(response.body).toEqual({
			success: true,
			data: {
				characters: [{ characterName: 'Aegon Targaryen' }],
			},
		});
	});

	it('should return bad request when missing required query parameters', async () => {
		const response = await request(app.server).get('/characters/search').expect(400);

		expect(response.body).toEqual({
			success: false,
			error: `data should have required property 'term'`,
			data: null,
		});
	});
});
