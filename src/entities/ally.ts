import { Type, Static } from '@sinclair/typebox';
import { Nullable } from '../tools/typebox';

export const Ally = Type.Object({
	id: Type.Number(),
	character_id: Type.Number(),
	ally_to: Nullable(Type.Number()),
});

export type Ally = Static<typeof Ally>;

export type AllyMapped = Static<typeof AllyMapped>;
export const AllyMapped = Type.Object({
	allies: Type.Optional(Type.Array(Type.String())),
});
