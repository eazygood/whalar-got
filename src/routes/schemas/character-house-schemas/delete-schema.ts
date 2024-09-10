import { Static, Type } from '@sinclair/typebox';
import { TypeObject } from '../../../tools/typebox';

export type DeleteOneCharacterHouseParam = Static<typeof DeleteOneCharacterHouseParam>;
export const DeleteOneCharacterHouseParam = Type.Object({
	character_id: Type.Number(),
	house_name: Type.String(),
});

export type DeleteOneCharacterHouseReply = Static<typeof DeleteOneCharacterHouseReply>;
export const DeleteOneCharacterHouseReply = TypeObject({
	id: Type.Number(),
});
