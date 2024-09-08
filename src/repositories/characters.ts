import { FastifyInstance } from "fastify";
import * as db from '../connectors/mysql-connector'
import { Character } from "../entities/character";
import { CHARACTERS_TABLE } from "../db/constants";

export async function findMany({ app }: { app: FastifyInstance }) {
    const conn = app.knex;
    return await db.buildAndRun<Character[]>({ 
        app, 
        callback: async (conn) => {
            return conn.table(CHARACTERS_TABLE).select<Character[]>();
        }
    });
}
