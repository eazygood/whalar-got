import { ObjectOptions, TProperties, TSchema, Type } from '@sinclair/typebox';

export const Nullable = <T extends TSchema>(type: T) => Type.Union([type, Type.Null()]);
export const TypeObject = <T extends TProperties>(type: T, options?: ObjectOptions) =>
	Type.Object(type, { additionalProperties: false, ...options });