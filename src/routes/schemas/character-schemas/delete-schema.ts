import { Static, Type } from '@sinclair/typebox';
import { Nullable, TypeObject } from '../../../tools/typebox';

export type DeleteOneCharacterParam = Static<typeof DeleteOneCharacterParam>;
export const DeleteOneCharacterParam = Type.Object({
	character_id: Type.Union([Type.Number(), Type.String()]),
});

export type DeleteOneCharacterReply = Static<typeof DeleteOneCharacterReply>;
export const DeleteOneCharacterReply = TypeObject({
	success: Type.Boolean(),
	error: Type.Optional(Type.String()),
});
