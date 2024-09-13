import { Static, Type } from '@sinclair/typebox';
import { TypeObject, Nullable } from '../../../tools/typebox';
import { GeneralResponse } from '../general-schema';

export type UpdateOneCharactersParam = Static<typeof UpdateOneCharactersParam>;
export const UpdateOneCharactersParam = Type.Object({
	character_id: Type.Number(),
});

export type UpdateOneCharactersBody = Static<typeof UpdateOneCharactersBody>;
export const UpdateOneCharactersBody = TypeObject({
	name: Type.String(),
	nickname: Type.Optional(Nullable(Type.String())),
	royal: Type.Optional(Type.Boolean()),
	kingsguard: Type.Optional(Type.Boolean()),
	link: Type.Optional(Nullable(Type.String())),
	image_full: Type.Optional(Nullable(Type.String())),
	image_thumb: Type.Optional(Nullable(Type.String())),
});

export type UpdateOneCharactersReply = Static<typeof UpdateOneCharactersReply>;
export const UpdateOneCharactersReply = GeneralResponse;
