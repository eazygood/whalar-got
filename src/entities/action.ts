import { Type, Static } from '@sinclair/typebox';
import { Nullable } from '../tools/typebox';
import { type } from 'os';

export enum ActionTypes {
	killed = 'killed',
	killedBy = 'killedBy',
	serves = 'serves',
	servedBy = 'servedBy',
	guardedBy = 'guardedBy',
	guardianOf = 'guardianOf',
	abducted = 'abducted',
	abductedBy = 'abductedBy',
}

export const Action = Type.Object({
	id: Type.Number(),
	character_id: Type.Number(),
	action_to: Nullable(Type.Number()),
	type: Type.Enum(ActionTypes),
});

export type Action = Static<typeof Action>;

export type ActionMapped = Static<typeof ActionMapped>;
export const ActionMapped = Type.Object({
	killed: Type.Optional(Type.Array(Type.String())),
	killedBy: Type.Optional(Type.Array(Type.String())),
	serves: Type.Optional(Type.Array(Type.String())),
	servedBy: Type.Optional(Type.Array(Type.String())),
	guardedBy: Type.Optional(Type.Array(Type.String())),
	guardianOf: Type.Optional(Type.Array(Type.String())),
	abducted: Type.Optional(Type.Array(Type.String())),
	abductedBy: Type.Optional(Type.Array(Type.String())),
});
