import { Static, Type } from '@sinclair/typebox';
import { TypeObject, Nullable } from '../../../tools/typebox';
import { CharacterSchema } from '../../../entities/character';

export type CreateOneCharactersBody = Static<typeof CreateOneCharactersBody>;
export const CreateOneCharactersBody = TypeObject({
	name: Type.String(),
	nickname: Nullable(Type.String()),
	royal: Type.Boolean(),
	kingsguard: Type.Boolean(),
	link: Nullable(Type.String()),
	image_full: Nullable(Type.String()),
	image_thumb: Nullable(Type.String()),
});

export type CreateOneCharactersReply = Static<typeof CreateOneCharactersReply>;
export const CreateOneCharactersReply = TypeObject({
	data: Nullable(CharacterSchema),
	error: Type.Optional(Type.String()),
});
