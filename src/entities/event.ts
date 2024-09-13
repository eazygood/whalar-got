import { Static, Type } from '@sinclair/typebox';
import { TypeObject, Nullable } from '../tools/typebox';

export type CreateOneCharactersEventPayload = Static<typeof CreateOneCharactersEventPayload>;
export const CreateOneCharactersEventPayload = TypeObject({
	name: Type.String(),
	nickname: Nullable(Type.String()),
	royal: Type.Boolean(),
	kingsguard: Type.Boolean(),
	link: Nullable(Type.String()),
	image_full: Nullable(Type.String()),
	image_thumb: Nullable(Type.String()),
});
