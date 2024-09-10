import { Static, Type } from '@sinclair/typebox';
import { CharacterSchema } from '../../../entities/character';
import { TypeObject, Nullable } from '../../../tools/typebox';

export type FindManyCharactersReply = Static<typeof FindManyCharactersReply>;
export const FindManyCharactersReply = TypeObject({
	data: Type.Array(CharacterSchema),
});

export type SearchCharactersQuerystring = Static<typeof SearchCharactersQuerystring>;
export const SearchCharactersQuerystring = Type.Object({
	character_ids: Type.Optional(Type.Array(Type.Number())),
	name: Type.Optional(Type.String()),
	nickname: Type.Optional(Nullable(Type.String())),
});

export type SearchActorQuerystring = Static<typeof SearchActorQuerystring>;
export const SearchActorQuerystring = Type.Object({
	character_ids: Type.Optional(Type.Array(Type.Number())),
	actor_name: Type.Optional(Type.String()),
});

export type SearchHouseQuerystring = Static<typeof SearchHouseQuerystring>;
export const SearchHouseQuerystring = Type.Object({
	character_ids: Type.Optional(Type.Array(Type.Number())),
	house_name: Type.Optional(Type.String()),
});

export type SearchSeasonQuerystring = Static<typeof SearchSeasonQuerystring>;
export const SearchSeasonQuerystring = Type.Object({
	actor_ids: Type.Optional(Type.Array(Type.Number())),
});

export type SearchAllyQuerystring = Static<typeof SearchAllyQuerystring>;
export const SearchAllyQuerystring = Type.Object({
	character_ids: Type.Optional(Type.Array(Type.Number())),
});

export type SearchRelationshipsQuerystring = Static<typeof SearchRelationshipsQuerystring>;
export const SearchRelationshipsQuerystring = Type.Object({
	character_ids: Type.Optional(Type.Array(Type.Number())),
});

export type SearchActionsQuerystring = Static<typeof SearchActionsQuerystring>;
export const SearchActionsQuerystring = Type.Object({
	character_ids: Type.Optional(Type.Array(Type.Number())),
	abducted: Type.Optional(Type.String()),
	abductedBy: Type.Optional(Type.String()),
	serves: Type.Optional(Type.String()),
	servedBy: Type.Optional(Type.String()),
	guardianOf: Type.Optional(Type.String()),
	guardedBy: Type.Optional(Type.String()),
	killed: Type.Optional(Type.String()),
	killedBy: Type.Optional(Type.String()),
});

export enum EntityTypes {
	character = 'character',
	actor = 'actor',
	house = 'house',
	relationship = 'relationship',
	action = 'action',
	season = 'season',
	ally = 'ally',
}

export enum FieldTypes {
	name = 'name',
	nickname = 'nickname',
	actorName = 'actor_name',
	houseName = 'house_name',
}

export type SearchItemsQueryString = Static<typeof SearchItemsQueryString>;
export const SearchItemsQueryString = Type.Object({
	term: Type.String(),
	entityTypes: Type.String(Type.Enum(EntityTypes)),
	searchForRelatedItems: Type.Boolean({ default: false }),
	fields: Type.String(Type.Enum(FieldTypes)),
});

export type SearchQuerystring = Static<typeof SearchQuerystring>;
export const SearchQuerystring = Type.Intersect([
	SearchCharactersQuerystring,
	SearchActorQuerystring,
	SearchHouseQuerystring,
	SearchAllyQuerystring,
	SearchRelationshipsQuerystring,
	// SearchActionsQuerystring,
	SearchItemsQueryString,
]);

export type SearchCharactersReply = Static<typeof SearchCharactersReply>;
export const SearchCharactersReply = TypeObject({
	data: Type.Any(),
});
