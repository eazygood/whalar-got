import { Static, Type } from '@sinclair/typebox';
import { CharacterSchema } from '../../../entities/character';
import { Nullable, TypeObject } from '../../../tools/typebox';
import { GeneralResponse } from '../general-schema';

export type FindOneCharacterReply = Static<typeof FindOneCharacterReply>;
export const FindOneCharacterReply = Type.Intersect([
	GeneralResponse,
	TypeObject({
		data: Nullable(CharacterSchema),
	}),
]);

export type FindOneCharactersParam = Static<typeof FindOneCharactersParam>;
export const FindOneCharactersParam = Type.Object({
	character_id: Type.Union([Type.Number(), Type.String()]),
});
