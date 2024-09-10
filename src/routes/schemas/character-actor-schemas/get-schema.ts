import { Static, Type } from '@sinclair/typebox';
import { Nullable, TypeObject } from '../../../tools/typebox';
import { ActorSchema } from '../../../entities/actor';

export type FindOneCharactersActorReply = Static<typeof FindOneCharactersActorReply>;
export const FindOneCharactersActorReply = TypeObject({
	data: Nullable(ActorSchema),
});

export type FindOneCharactersActorParam = Static<typeof FindOneCharactersActorParam>;
export const FindOneCharactersActorParam = Type.Object({
	character_id: Type.Number(),
    actor_id: Type.Number(),
});
