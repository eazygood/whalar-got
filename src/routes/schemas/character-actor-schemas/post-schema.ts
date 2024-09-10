import { Static, Type } from '@sinclair/typebox';
import { CharacterSchema } from '../../../entities/character';
import { TypeObject } from '../../../tools/typebox';

export type CreateOneCharacterActorReply = Static<typeof CreateOneCharacterActorReply>;
export const CreateOneCharacterActorReply = TypeObject({
	data: CharacterSchema,
});

export type CreateOneCharacterActorParams = Static<typeof CreateOneCharacterActorParams>;
export const CreateOneCharacterActorParams = Type.Object({
	character_id: Type.Number(),
	actor_id: Type.Number(),
});
