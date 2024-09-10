import { Static, Type } from '@sinclair/typebox';
import { CharacterSchema } from '../../../entities/character';
import { Nullable, TypeObject } from '../../../tools/typebox';
import { ActorSchema } from '../../../entities/actor';

export type CreateOneCharacterActorReply = Static<typeof CreateOneCharacterActorReply>;
export const CreateOneCharacterActorReply = TypeObject({
	data: ActorSchema,
});

export type CreateOneCharacterActorParams = Static<typeof CreateOneCharacterActorParams>;
export const CreateOneCharacterActorParams = Type.Object({
	character_id: Type.Number(),
});

export type CreateOneCharacterActorBody = Static<typeof CreateOneCharacterActorBody>;
export const CreateOneCharacterActorBody = Type.Object({
	name: Type.String(),
	link: Nullable(Type.String()),
});