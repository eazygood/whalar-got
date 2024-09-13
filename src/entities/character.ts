import { Type, Static } from '@sinclair/typebox';
import { Nullable, TypeObject } from '../tools/typebox';

export type CharacterToAdd = Static<typeof CharacterToAdd>;
export const CharacterToAdd = Type.Object({
	name: Type.String(),
	nickname: Type.Optional(Nullable(Type.String())),
	royal: Type.Optional(Type.Boolean()),
	kingsguard: Type.Optional(Type.Boolean()),
	link: Type.Optional(Nullable(Type.String())),
	image_full: Type.Optional(Nullable(Type.String())),
	image_thumb: Type.Optional(Nullable(Type.String())),
});

export type Character = Static<typeof CharacterSchema>;
export const CharacterSchema = Type.Intersect([
	Type.Object({
		id: Type.Number(),
	}),
	CharacterToAdd,
]);

export type CharacterMapped = Static<typeof CharacterMapped>;
export const CharacterMapped = Type.Object({
	characterName: Type.Optional(Type.String()),
	nickname: Type.Optional(Nullable(Type.String())),
	royal: Type.Optional(Type.Boolean()),
	kingsguard: Type.Optional(Type.Boolean()),
	characterLink: Type.Optional(Nullable(Type.String())),
	characterImageThumb: Type.Optional(Nullable(Type.String())),
	characterImageFull: Type.Optional(Nullable(Type.String())),
});
