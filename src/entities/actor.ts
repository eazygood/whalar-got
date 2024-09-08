import { Type, Static } from "@sinclair/typebox";
import { Nullable } from "../tools/typebox";

export const ActorSchema = Type.Object({
  id: Type.Number(),
  character_id: Type.Number(),
  name: Type.String(),
  link: Nullable(Type.String()),
});
export type Actor = Static<typeof ActorSchema>;
