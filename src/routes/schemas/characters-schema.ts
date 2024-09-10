// import { Static, Type } from '@sinclair/typebox';
// import { Nullable, TypeObject } from '../../tools/typebox';
// import { CharacterSchema } from '../../entities/character';
// import { ActorSchema } from '../../entities/actor';

// export type FindManyCharactersReply = Static<typeof FindManyCharactersReply>;
// export const FindManyCharactersReply = TypeObject({
// 	data: Type.Array(CharacterSchema),
// });

// export type SearchCharactersQuerystring = Static<typeof SearchCharactersQuerystring>;
// export const SearchCharactersQuerystring = Type.Object({
// 	name: Type.Optional(Type.String()),
// 	nickname: Type.Optional(Nullable(Type.String())),
// });

// export type SearchActorQuerystring = Static<typeof SearchActorQuerystring>;
// export const SearchActorQuerystring = Type.Object({
// 	character_ids: Type.Optional(Type.Array(Type.Number())),
// 	actor_name: Type.Optional(Type.String()),
// });

// export type SearchHouseQuerystring = Static<typeof SearchHouseQuerystring>;
// export const SearchHouseQuerystring = Type.Object({
// 	house_name: Type.Optional(Type.String()),
// });

// export type SearchAllyQuerystring = Static<typeof SearchAllyQuerystring>;
// export const SearchAllyQuerystring = Type.Object({
// 	ally_name: Type.Optional(Type.String()),
// });

// export type SearchRelationshipsQuerystring = Static<typeof SearchRelationshipsQuerystring>;
// export const SearchRelationshipsQuerystring = Type.Object({
// 	parentOf: Type.Optional(Type.String()),
// 	marriedEngaged: Type.Optional(Type.String()),
// 	sibling: Type.Optional(Type.String()),
// });

// export type SearchActionsQuerystring = Static<typeof SearchActionsQuerystring>;
// export const SearchActionsQuerystring = Type.Object({
// 	abducted: Type.Optional(Type.String()),
// 	abductedBy: Type.Optional(Type.String()),
// 	serves: Type.Optional(Type.String()),
// 	servedBy: Type.Optional(Type.String()),
// 	guardianOf: Type.Optional(Type.String()),
// 	guardedBy: Type.Optional(Type.String()),
// 	killed: Type.Optional(Type.String()),
// 	killedBy: Type.Optional(Type.String()),
// });

// export enum EntityTypes {
// 	character = 'character',
// 	actor = 'actor',
// 	house = 'house',
// 	relationship = 'relationship',
// 	action = 'action',
// 	season = 'season',
// 	ally = 'ally',
// }

// export enum FieldTypes {
// 	name = 'name',
// 	nickname = 'nickname',
// 	actorName = 'actor_name',
// 	houseName = 'house_name',
// }

// export type SearchItemsQueryString = Static<typeof SearchItemsQueryString>;
// export const SearchItemsQueryString = Type.Object({
// 	term: Type.String(),
// 	entityTypes: Type.String(Type.Enum(EntityTypes)),
// 	searchForRelatedItems: Type.Boolean({ default: false }),
// 	fields: Type.String(Type.Enum(FieldTypes)),
// });

// export type SearchQuerystring = Static<typeof SearchQuerystring>;
// export const SearchQuerystring = Type.Intersect([
// 	SearchCharactersQuerystring,
// 	SearchActorQuerystring,
// 	SearchHouseQuerystring,
// 	SearchAllyQuerystring,
// 	SearchRelationshipsQuerystring,
// 	// SearchActionsQuerystring,
// 	SearchItemsQueryString,
// ]);

// export type SearchCharactersReply = Static<typeof SearchCharactersReply>;
// export const SearchCharactersReply = TypeObject({
// 	data: Type.Array(
// 		Type.Intersect([
// 			CharacterSchema,
// 			// ActorSchema,
// 		]),
// 	),
// });
