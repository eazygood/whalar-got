import { Type, Static } from '@sinclair/typebox';
import { Nullable } from '../tools/typebox';

export const HouseSchema = Type.Object({
	id: Type.Number(),
	character_id: Type.Number(),
	name: Type.String(),
});
export type House = Static<typeof HouseSchema>;
