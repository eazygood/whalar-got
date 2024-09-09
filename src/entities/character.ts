import { Type, Static } from "@sinclair/typebox";
import { Nullable } from "../tools/typebox";

export type Character = Static<typeof CharacterSchema>;
export const CharacterSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  nickname: Nullable(Type.String()),
  royal: Type.Boolean(),
  kingsguard: Type.Boolean(),
  link: Nullable(Type.String()),
  image_full: Nullable(Type.String()),
  image_thumb: Nullable(Type.String()),
});


export type CharacterToAdd = Static<typeof CharacterToAdd>;
export const CharacterToAdd = Type.Object({
  name: Type.String(),
  nickname: Nullable(Type.String()),
  royal: Type.Boolean(),
  kingsguard: Type.Boolean(),
  link: Nullable(Type.String()),
  image_full: Nullable(Type.String()),
  image_thumb: Nullable(Type.String()),
});


