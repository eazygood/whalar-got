import { Static, Type } from '@sinclair/typebox';
import { CharacterSchema } from '../../../entities/character';
import { Nullable, TypeObject } from '../../../tools/typebox';

export type FindOneCharactersReply = Static<typeof FindOneCharactersReply>;
export const FindOneCharactersReply = TypeObject({
	data: Nullable(CharacterSchema),
});

export type FindOneCharactersParam = Static<typeof FindOneCharactersParam>;
export const FindOneCharactersParam = Type.Object({
	character_id: Type.Number(),
});
