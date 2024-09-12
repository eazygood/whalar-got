import { Static, Type } from '@sinclair/typebox';
import { Nullable, TypeObject } from '../../../tools/typebox';
import { GeneralResponse } from '../general-schema';

export type DeleteOneCharacterParam = Static<typeof DeleteOneCharacterParam>;
export const DeleteOneCharacterParam = Type.Object({
	character_id: Type.Union([Type.Number(), Type.String()]),
});

export type DeleteOneCharacterReply = Static<typeof DeleteOneCharacterReply>;
export const DeleteOneCharacterReply = GeneralResponse;
