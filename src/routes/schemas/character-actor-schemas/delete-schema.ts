import { Static, Type } from '@sinclair/typebox';
import { TypeObject } from '../../../tools/typebox';

export type DeleteOneCharacterActorParam = Static<typeof DeleteOneCharacterActorParam>;
export const DeleteOneCharacterActorParam = Type.Object({
	character_id: Type.Number(),
	actor_id: Type.Number(),
});

export type DeleteOneCharacterActorReply = Static<typeof DeleteOneCharacterActorReply>;
export const DeleteOneCharacterActorReply = TypeObject({
	id: Type.Number(),
});
