import { Type, Static } from '@sinclair/typebox';
import { Nullable } from '../tools/typebox';

export enum RelationTypes {
	parent = 'parent',
	parentOf = 'parentOf',
	sibling = 'sibling',
	marriedEngaged = 'married_engaged',
}

export const RelationshipSchema = Type.Object({
	id: Type.Number(),
	character_id: Type.Number(),
	relation_to: Nullable(Type.Number()),
	type: Type.Enum(RelationTypes),
});

export type Relationship = Static<typeof RelationshipSchema>;
