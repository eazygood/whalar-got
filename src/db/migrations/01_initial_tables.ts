import { Knex } from "knex";
import {
  ACTIONS_TABLE,
  ACTORS_TABLE,
  ALLIES_TABLE,
  CHARACTERS_TABLE,
  HOUSES_TABLE,
  RELATIONSHIPS_TABLE,
  SEASONS_TABLE,
} from "../constants";

export async function up(knex: Knex): Promise<void> {
  await createCharactersTable(knex);
  await createActorsTable(knex);
  await createSeasonsTable(knex);
  await createHousesTable(knex);
  await createAlliesTable(knex);
  await createActionsTable(knex);
  await createRelationshipsTable(knex);
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists(CHARACTERS_TABLE);
  await knex.schema.dropTableIfExists(ACTORS_TABLE);
  await knex.schema.dropTableIfExists(SEASONS_TABLE);
  await knex.schema.dropTableIfExists(HOUSES_TABLE);
  await knex.schema.dropTableIfExists(ALLIES_TABLE);
  await knex.schema.dropTableIfExists(ACTIONS_TABLE);
  await knex.schema.dropTableIfExists(RELATIONSHIPS_TABLE);
}

async function createCharactersTable(knex: Knex): Promise<void> {
  await knex.schema.createTable(CHARACTERS_TABLE, (table) => {
    table.increments("id").primary();
    table.string("name", 100).notNullable();
    table.string("nickname", 100);
    table.boolean("royal").defaultTo(false);
    table.boolean("kingsguard").defaultTo(false);
    table.text("link");
    table.text("image_full");
    table.text("image_thumb");
  });
}

async function createActorsTable(knex: Knex): Promise<void> {
  await knex.schema.createTable(ACTORS_TABLE, (table) => {
    table.increments("id").primary();
    table.integer("character_id").unsigned();
    table.string("name", 100).notNullable();
    table.text("link");
    table
      .foreign("character_id")
      .references('id')
      .inTable(CHARACTERS_TABLE)
      .onDelete("CASCADE")
  });
}

async function createSeasonsTable(knex: Knex): Promise<void> {
  await knex.schema.createTable(SEASONS_TABLE, (table) => {
    table.increments("id").primary();
    table.integer("actor_id").unsigned();
    table.integer("count");

    table
      .foreign("actor_id")
      .references("id")
      .inTable(ACTORS_TABLE)
      .onDelete("CASCADE");
  });
}

async function createHousesTable(knex: Knex): Promise<void> {
  await knex.schema.createTable(HOUSES_TABLE, (table) => {
    table.increments("id").primary();
    table.integer("character_id").unsigned();
    table.string("name", 100).notNullable();

    // Foreign key for character_id referencing characters(id)
    table
      .foreign("character_id")
      .references("id")
      .inTable(CHARACTERS_TABLE)
      .onDelete("CASCADE");
  });
}

async function createAlliesTable(knex: Knex): Promise<void> {
  await knex.schema.createTable(ALLIES_TABLE, (table) => {
    table.increments("id").primary();
    table.integer("character_id").unsigned();
    table.integer("ally_to").unsigned();

    // Foreign key for character_id and ally_to referencing characters(id)
    table
      .foreign("character_id")
      .references("id")
      .inTable(CHARACTERS_TABLE)
      .onDelete("CASCADE");

    table
      .foreign("ally_to")
      .references("id")
      .inTable(CHARACTERS_TABLE)
      .onDelete("CASCADE");
  });
}

async function createActionsTable(knex: Knex): Promise<void> {
  await knex.schema.createTable(ACTIONS_TABLE, (table) => {
    table.increments("id").primary();
    table.integer("character_id").unsigned();
    table.integer("action_to").unsigned();
    table
      .enu("type", ["killed", "served", "guarded", "abducted"])
      .notNullable();

    // Foreign key for character_id and action_to referencing characters(id)
    table
      .foreign("character_id")
      .references("id")
      .inTable("characters")
      .onDelete("CASCADE");

    table
      .foreign("action_to")
      .references("id")
      .inTable("characters")
      .onDelete("CASCADE");
  });
}

async function createRelationshipsTable(knex: Knex): Promise<void> {
  await knex.schema.createTable(RELATIONSHIPS_TABLE, (table) => {
    table.increments("id").primary();
    table.integer("character_id").unsigned();
    table.integer("relation_to").unsigned();
    table.enu("type", ["parent", "sibling", "married_engaged"]).notNullable();

    // Foreign key for character_id and relation_to referencing characters(id)
    table
      .foreign("character_id")
      .references("id")
      .inTable(CHARACTERS_TABLE)
      .onDelete("CASCADE");

    table
      .foreign("relation_to")
      .references("id")
      .inTable(CHARACTERS_TABLE)
      .onDelete("CASCADE");
  });
}
