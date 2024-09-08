import fastify from "fastify";
import knexPlugin from "./plugins/knex-plugin";
import { getConfig, registerMysqlDatabase } from "./connectors/mysql-connector";
import registerPublicRoutes from "./routes";

const f = fastify()

export default f
  .register(knexPlugin, getConfig())
  .register(registerMysqlDatabase)
  .register(registerPublicRoutes, { prefix: 'api/v1'});
