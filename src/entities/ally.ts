import { Type, Static } from '@sinclair/typebox';
import { Nullable } from '../tools/typebox';

export const AllySchema = Type.Object({
	id: Type.Number(),
	character_id: Type.Number(),
	ally_to: Nullable(Type.Number()),
});

export type Ally = Static<typeof AllySchema>;
