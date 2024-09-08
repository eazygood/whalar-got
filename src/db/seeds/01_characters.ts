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
import { prepareDbData } from '../../../scripts/got-characters-parser';
import data from '../../../scripts/got-characters.json';

const {
    characters,
    relationships,
    actions,
    allies,
    actors,
    seasons,
    houses,
} = prepareDbData(data.characters)


const TABLES: { [key: string]: any } = {
  [CHARACTERS_TABLE]: characters,
  [ACTORS_TABLE]: actors,
  [SEASONS_TABLE]: seasons,
  [ACTIONS_TABLE]: actions,
  [ALLIES_TABLE]: allies,
  [HOUSES_TABLE]: houses,
  [RELATIONSHIPS_TABLE]: relationships,
};

export async function seed(knex: Knex): Promise<void> {
  for (const table in TABLES) {
    await knex.table(table).del();
    await knex(table).insert(TABLES[table]);
  }
}
