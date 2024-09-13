import { Type, Static } from '@sinclair/typebox';
import { Nullable } from '../tools/typebox';

export const House = Type.Object({
	id: Type.Number(),
	character_id: Type.Number(),
	name: Type.String(),
});
export type House = Static<typeof House>;

export type HouseMapped = Static<typeof HouseMapped>;
export const HouseMapped = Type.Object({
	houseName: Type.Optional(Type.Union([Type.String(), Type.Array(Type.String())])),
});
