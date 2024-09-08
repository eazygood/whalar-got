import { Type, Static } from "@sinclair/typebox";
import { Nullable } from "../tools/typebox";

export const SeasonSchema = Type.Object({
  id: Type.Number(),
  actor_id: Type.Number(),
  count: Type.Number(),
});
export type Season = Static<typeof SeasonSchema>;
