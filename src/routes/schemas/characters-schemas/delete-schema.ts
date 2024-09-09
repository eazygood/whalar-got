import { Static, Type } from "@sinclair/typebox";
import { TypeObject } from "../../../tools/typebox";

export type DeleteOneCharacterParam = Static<typeof DeleteOneCharacterParam>;
export const DeleteOneCharacterParam = Type.Object({
	character_id: Type.Number()
}); 

export type DeleteOneCharacterReply = Static<typeof DeleteOneCharacterReply>;
export const DeleteOneCharacterReply = TypeObject({
	id: Type.Number(),
})