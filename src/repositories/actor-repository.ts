import { FastifyInstance } from "fastify";
import _ from 'lodash';
import * as db from '../connectors/mysql-connector'
import { Character } from "../entities/character";
import { CHARACTERS_TABLE } from "../db/constants";
import { SearchActorQuerystring, SearchCharactersQuerystring } from "../routes/schemas";
import { Actor } from "../entities/actor";


export async function findMany({ app, searchQuery }: { app: FastifyInstance, searchQuery?: SearchActorQuerystring }) {
    const conn = app.knex;
    return await db.buildAndRun<Actor[]>({ 
        app, 
        callback: async (conn) => {
            if (_.isEmpty(searchQuery)) {
                return [];
            }

            console.log('actor searchQuery: ', searchQuery);

            const query = conn.table(CHARACTERS_TABLE).select();

            if (searchQuery.actor_name) {
                query.andWhere({ name: searchQuery.actor_name})
            }

            return query;
        }
    });
}

