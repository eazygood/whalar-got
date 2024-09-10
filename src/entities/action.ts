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

export const ActionSchema = Type.Object({
	id: Type.Number(),
	character_id: Type.Number(),
	action_to: Nullable(Type.Number()),
	type: Type.Enum(ActionTypes),
});

export type Action = Static<typeof ActionSchema>;
