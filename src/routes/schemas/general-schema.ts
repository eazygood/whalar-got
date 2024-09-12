import { Static, Type } from "@sinclair/typebox";
import { TypeObject } from "../../tools/typebox";

export type GeneralResponse = Static<typeof GeneralResponse>;
export const GeneralResponse = TypeObject({
	success: Type.Boolean(),
    error: Type.Optional(Type.String())
});