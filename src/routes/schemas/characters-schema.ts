import { Static, Type } from "@sinclair/typebox";
import { TypeObject } from "../../tools/typebox";
import { CharacterSchema } from "../../entities/character";

export type FindManyCharactersReply = Static<typeof FindManyCharactersReply>;
export const FindManyCharactersReply = TypeObject({
	data: Type.Array(CharacterSchema),
});