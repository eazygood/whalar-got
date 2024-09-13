import { Static, Type } from '@sinclair/typebox';
import { TypeObject, Nullable } from '../tools/typebox';

export type CreateOneCharactersEventPayload = Static<typeof CreateOneCharactersEventPayload>;
export const CreateOneCharactersEventPayload = TypeObject({
	name: Type.String(),
	nickname: Type.Optional(Nullable(Type.String())),
	royal: Type.Optional(Type.Boolean()),
	kingsguard: Type.Optional(Type.Boolean()),
	link: Type.Optional(Nullable(Type.String())),
	image_full: Type.Optional(Nullable(Type.String())),
	image_thumb: Type.Optional(Nullable(Type.String())),
});

export type EntityEvent = Static<typeof EntityEvent>;
export const EntityEvent = CreateOneCharactersEventPayload;
