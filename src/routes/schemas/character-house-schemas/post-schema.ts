import { Static, Type } from '@sinclair/typebox';
import { CharacterSchema } from '../../../entities/character';
import { TypeObject } from '../../../tools/typebox';

export type CreateOneCharacterHouseReply = Static<typeof CreateOneCharacterHouseReply>;
export const CreateOneCharacterHouseReply = TypeObject({
	data: CharacterSchema,
});

export type CreateOneCharacterHouseParams = Static<typeof CreateOneCharacterHouseParams>;
export const CreateOneCharacterHouseParams = Type.Object({
	character_id: Type.Number(),
	house_name: Type.String(),
});
