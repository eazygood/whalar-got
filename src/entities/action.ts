import { Type, Static } from "@sinclair/typebox";
import { Nullable } from "../tools/typebox";
import { type } from "os";

enum ActionTypes {
    killed = 'killed',
    served = 'served',
    guarded = 'guarded',
    abducted = 'abducted'
}

export const ActionSchema = Type.Object({
  id: Type.Number(),
  character_id: Type.Number(),
  action_to: Nullable(Type.Number()),
  type: Type.Enum(ActionTypes),
});

export type Action = Static<typeof ActionSchema>;
