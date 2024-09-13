import { Type, Static } from '@sinclair/typebox';
import { Nullable } from '../tools/typebox';

export enum RelationTypes {
	parent = 'parent',
	parentOf = 'parentOf',
	sibling = 'sibling',
	marriedEngaged = 'married_engaged',
}

export const Relationship = Type.Object({
	id: Type.Number(),
	character_id: Type.Number(),
	relation_to: Nullable(Type.Number()),
	type: Type.Enum(RelationTypes),
});

export type Relationship = Static<typeof Relationship>;

export type RelationshipMapped = Static<typeof RelationshipMapped>;
export const RelationshipMapped = Type.Object({
	parent: Type.Optional(Type.Array(Type.String())),
	parentOf: Type.Optional(Type.Array(Type.String())),
	sibling: Type.Optional(Type.Array(Type.String())),
	marriedEngaged: Type.Optional(Type.Array(Type.String())),
});
