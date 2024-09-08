import { FastifyInstance } from "fastify";
import * as characterRepository from '../repositories/characters';

export async function findMany({ app }: { app: FastifyInstance }) {
    return await characterRepository.findMany({ app });
}
