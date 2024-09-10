import { Type, Static } from '@sinclair/typebox';
import { Nullable } from '../tools/typebox';

export type Actor = Static<typeof ActorSchema>;
export const ActorSchema = Type.Object({
	id: Type.Number(),
	character_id: Type.Number(),
	name: Type.String(),
	link: Nullable(Type.String()),
});


export type ActorToAdd = Static<typeof ActorToAdd>;
export const ActorToAdd = Type.Object({
	character_id: Type.Number(),
	name: Type.String(),
	link: Nullable(Type.String()),
});

