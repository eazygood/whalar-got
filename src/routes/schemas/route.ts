import { RouteGenericInterface, RouteOptions, RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression } from "fastify";

export type Route<Types extends RouteGenericInterface> = RouteOptions<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  Types
>;