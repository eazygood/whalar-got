// "characterName":"Lysa Arryn",
// "characterImageThumb":"https://images-na.ssl-images-amazon.com/images/M/MV5BMmNlYTYzOTYtOTg1ZC00YzdlLTliNTgtZDhjMTY1MGViZTA5XkEyXkFqcGdeQXVyMjk3NTUyOTc@._V1._SX100_SY140_.jpg",
// "characterImageFull":"https://images-na.ssl-images-amazon.com/images/M/MV5BMmNlYTYzOTYtOTg1ZC00YzdlLTliNTgtZDhjMTY1MGViZTA5XkEyXkFqcGdeQXVyMjk3NTUyOTc@._V1_.jpg",
// "characterLink":"/character/ch0251736/",
// "actorName":"Kate Dickie",
// "actorLink":"/name/nm0225483/",
// "houseName":[
//    "Arryn",
//    "Tully"
// ],
// "killed":[
//    "Jon Arryn"
// ],
// "killedBy":[
//    "Petyr Baelish"
// ],
// "marriedEngaged":[
//    "Petyr Baelish"
// ],
// "parents":[
//    "Hoster Tully"
// ],
// "siblings":[
//    "Catelyn Tully",
//    "Edmure Tully"
// ]

import data from './got-characters.json';
import fs from 'fs';
import { type } from 'os';
import path from 'path';

const DB_TABLE_NAME = 'game_of_thrones';

type Characters = {
	characterName: string;
	characterImageThumb?: string;
	characterImageFull?: string;
	characterLink?: string;
	royal?: boolean;
	kingsguard?: boolean;
	nickname?: string;
	actorName?: string;
	actors?: Actor[];
	actorLink?: string;
	houseName?: string | string[];
	killed?: string[];
	killedBy?: string[];
	marriedEngaged?: string[];
	parents?: string[];
	parentOf?: string[];
	siblings?: string[];
	allies?: string[];
	serves?: string[];
	servedBy?: string[];
	guardianOf?: string[];
	guardedBy?: string[];
	abducted?: string[];
	abductedBy?: string[];
};

type Actor = {
	actorName: string;
	actorLink: string;
	seasonsActive: number[];
};

type CharactersDb = {
	id: number;
	name: string;
	nickname: string | null;
	royal: boolean;
	kingsguard: boolean;
	link: string | null;
	image_full: string | null;
	image_thumb: string | null;
};

type ActorsDb = {
	id: number;
	character_id: number;
	name: string;
	link: string | null;
};

type SeasonActiveDb = {
	id: number;
	actor_id: number;
	count: number;
};

type HousesDb = {
	id: number;
	character_id: number;
	name: string;
};

type AlliesDb = {
	id: number;
	character_id: number;
	ally_to: string | number | null;
};

type ActionsDb = {
	id: number;
	character_id: number;
	action_to: number | string | null;
	type: ActionTypes;
};

type RelationshipsDb = {
	id: number;
	character_id: number;
	relation_to: number | string | null;
	type: RelationTypes;
};

enum RelationTypes {
	parent = 'parent',
	parentOf = 'parentOf',
	sibling = 'sibling',
	marriedEngaged = 'married_engaged',
}

enum ActionTypes {
	killed = 'killed',
	killedBy = 'killedBy',
	serves = 'serves',
	servedBy = 'servedBy',
	guardedBy = 'guardedBy',
	guardianOf = 'guardianOf',
	abducted = 'abducted',
	abductedBy = 'abductedBy',
}

function getCharacterDbEntity(id: number, character: Characters): CharactersDb {
	return {
		id,
		name: character.characterName.replace(/'/g, "''"),
		nickname: character.nickname ?? null,
		royal: !!character.royal,
		kingsguard: !!character.kingsguard,
		link: character.characterLink ?? null,
		image_full: character.characterImageFull ?? null,
		image_thumb: character.characterImageThumb ?? null,
	};
}

function getRelationships(
	relationshipsId: number,
	characterId: number,
	relations: string,
	type: RelationTypes,
): RelationshipsDb {
	return {
		id: relationshipsId,
		character_id: characterId,
		relation_to: relations,
		type,
	};
}

function getAction(
	actionId: number,
	characterId: number,
	actionTo: string,
	type: ActionTypes,
): ActionsDb {
	return {
		id: actionId,
		character_id: characterId,
		action_to: actionTo,
		type,
	};
}

function getAlly(allyId: number, characterId: number, allyTo: string): AlliesDb {
	return {
		id: allyId,
		character_id: characterId,
		ally_to: allyTo,
	};
}

function getActor(
	actorId: number,
	characterId: number,
	actorName: string,
	actorLink: string | null,
): ActorsDb {
	return {
		id: actorId,
		character_id: characterId,
		name: actorName,
		link: actorLink,
	};
}

function getSeasons(seasonId: number, actorId: number, count: number): SeasonActiveDb {
	return {
		id: seasonId,
		actor_id: actorId,
		count,
	};
}

function getHouse(houseId: number, characterId: number, name: string): HousesDb {
	return {
		id: houseId,
		character_id: characterId,
		name,
	};
}

function prepareDataForDb(data: Characters[]): any {
	const characters: CharactersDb[] = [];
	const relationships: RelationshipsDb[] = [];
	const actions: ActionsDb[] = [];
	const allies: AlliesDb[] = [];
	const actors: ActorsDb[] = [];
	const seasons: SeasonActiveDb[] = [];
	const houses: HousesDb[] = [];
	const nameToId: { [key: string]: number } = {};

	let characterId = 1;
	let relationshipId = 1;
	let actionId = 1;
	let allyId = 1;
	let actorId = 1;
	let seasonId = 1;
	let houseId = 1;

	for (const character of data) {
		// characters
		const characterDb = getCharacterDbEntity(characterId, character);
		characters.push(characterDb);
		nameToId[characterDb.name] = characterId;

		// relationships
		character.parentOf?.forEach((relation) => {
			const relationshipsDb = getRelationships(
				relationshipId,
				characterId,
				relation,
				RelationTypes.parentOf,
			);
			relationships.push(relationshipsDb);
			relationshipId += 1;
		});

		character.parents?.forEach((relation) => {
			const relationshipsDb = getRelationships(
				relationshipId,
				characterId,
				relation,
				RelationTypes.parent,
			);
			relationships.push(relationshipsDb);
			relationshipId += 1;
		});

		character.siblings?.forEach((relation) => {
			const relationshipsDb = getRelationships(
				relationshipId,
				characterId,
				relation,
				RelationTypes.sibling,
			);
			relationships.push(relationshipsDb);
			relationshipId += 1;
		});

		character.marriedEngaged?.forEach((relation) => {
			const relationshipsDb = getRelationships(
				relationshipId,
				characterId,
				relation,
				RelationTypes.marriedEngaged,
			);
			relationships.push(relationshipsDb);
			relationshipId += 1;
		});

		// actions
		character.killed?.forEach((c) => {
			const actionDb = getAction(actionId, characterId, c, ActionTypes.killed);
			actions.push(actionDb);
			actionId += 1;
		});

		character.killedBy?.forEach((c) => {
			const actionDb = getAction(actionId, characterId, c, ActionTypes.killedBy);
			actions.push(actionDb);
			actionId += 1;
		});

		character.serves?.forEach((c) => {
			const actionDb = getAction(actionId, characterId, c, ActionTypes.serves);
			actions.push(actionDb);
			actionId += 1;
		});

		character.servedBy?.forEach((c) => {
			const actionDb = getAction(actionId, characterId, c, ActionTypes.servedBy);
			actions.push(actionDb);
			actionId += 1;
		});

		character.guardianOf?.forEach((c) => {
			const actionDb = getAction(actionId, characterId, c, ActionTypes.guardianOf);
			actions.push(actionDb);
			actionId += 1;
		});

		character.guardedBy?.forEach((c) => {
			const actionDb = getAction(actionId, characterId, c, ActionTypes.guardedBy);
			actions.push(actionDb);
			actionId += 1;
		});

		character.abducted?.forEach((c) => {
			const actionDb = getAction(actionId, characterId, c, ActionTypes.abducted);
			actions.push(actionDb);
			actionId += 1;
		});

		character.abductedBy?.forEach((c) => {
			const actionDb = getAction(actionId, characterId, c, ActionTypes.abductedBy);
			actions.push(actionDb);
			actionId += 1;
		});

		// allies
		character.allies?.forEach((c) => {
			const allyDb = getAlly(allyId, characterId, c);
			allies.push(allyDb);
			allyId += 1;
		});

		// actors
		if (character.actorName) {
			const actorDb = getActor(
				actorId,
				characterId,
				character.actorName,
				character.actorLink ?? null,
			);
			actors.push(actorDb);
			actorId += 1;
		}

		character.actors?.forEach((a) => {
			const actorDb = getActor(actorId, characterId, a.actorName, a.actorLink);
			actors.push(actorDb);
			actorId += 1;

			a.seasonsActive?.forEach((seasonsCount) => {
				const seasonDb = getSeasons(seasonId, actorId, seasonsCount);
				seasons.push(seasonDb);
				seasonId += 1;
			});
		});

		// houses
		if (typeof character.houseName === 'string') {
			character.houseName = [character.houseName];
		}

		character.houseName?.forEach((h) => {
			const house = getHouse(houseId, characterId, h);
			houses.push(house);
			houseId += 1;
		});

		// custom character if increment
		characterId += 1;
	}

	return {
		characters,
		relationships,
		actions,
		allies,
		actors,
		seasons,
		houses,
		nameToId,
	};
}

function nameToIdFroRelationships(
	relationships: RelationshipsDb[],
	nameToId: { [key: string]: number },
): RelationshipsDb[] {
	relationships.forEach((r) => {
		const relationTo = r.relation_to;

		if (relationTo && nameToId[relationTo]) {
			r.relation_to = nameToId[relationTo];
		} else {
			r.relation_to = null;
		}
	});

	return relationships;
}

function nameToIdFroActions(
	actions: ActionsDb[],
	nameToId: { [key: string]: number },
): ActionsDb[] {
	actions.forEach((a) => {
		const actionsTo = a.action_to;
		if (actionsTo && nameToId[actionsTo]) {
			a.action_to = nameToId[actionsTo];
		} else {
			a.action_to = null;
		}
	});

	return actions;
}

function nameToIdFroAllies(allies: AlliesDb[], nameToId: { [key: string]: number }): AlliesDb[] {
	allies.forEach((a) => {
		const allyTo = a.ally_to;
		if (allyTo && nameToId[allyTo]) {
			a.ally_to = nameToId[allyTo];
		} else {
			a.ally_to = null;
		}
	});

	return allies;
}

export function prepareDbData(data: Characters[]) {
	const { characters, relationships, actions, allies, actors, seasons, houses, nameToId } =
		prepareDataForDb(data);

	return {
		characters,
		relationships: nameToIdFroRelationships(relationships, nameToId),
		actions: nameToIdFroActions(actions, nameToId),
		allies: nameToIdFroAllies(allies, nameToId),
		actors,
		seasons,
		houses,
	};
}

function prepareDbStatements(data: Characters[]) {
	const { characters, relationships, actions, allies, actors, seasons, houses } =
		prepareDbData(data);

	saveDataToFileAsJSON(characters, path.join(__dirname, './seeds/characters.json'));
	saveDataToFileAsJSON(relationships, path.join(__dirname, './seeds/relationships.json'));
	saveDataToFileAsJSON(actions, path.join(__dirname, './seeds/actions.json'));
	saveDataToFileAsJSON(allies, path.join(__dirname, './seeds/allies.json'));
	saveDataToFileAsJSON(actors, path.join(__dirname, './seeds/actors.json'));
	saveDataToFileAsJSON(seasons, path.join(__dirname, './seeds/seasons.json'));
	saveDataToFileAsJSON(houses, path.join(__dirname, './seeds/houses.json'));

	// const getInsertCharcterStatement = (c: CharactersDb) => `INSERT INTO characters (id, name, nickname, royal, kingsguard, link, image_full, image_thumb) VALUES (${c.id}, '${c.name}', '${c.nickname}', ${c.royal}, ${c.kingsguard}, '${c.link}', '${c.image_full}', '${c.image_thumb}');`
	// const getInsertRelationshipsStatement = (r: RelationshipsDb) => `INSERT INTO relationships (id, character_id, relation_to, type) VALUES (${r.id}, ${r.character_id}, ${r.relation_to}, '${r.type}');`
	// const getInsertActionsStatement = (a: ActionsDb) => `INSERT INTO actions (id, character_id, action_to, type) VALUES (${a.id}, ${a.character_id}, ${a.action_to}, '${a.type}');`
	// const getInsertAlliesStatement = (a: AlliesDb) => `INSERT INTO allies (id, character_id, ally_to) VALUES (${a.id}, ${a.character_id}, ${a.ally_to});`
	// const getInsertActorsStatement = (a: ActorsDb) => `INSERT INTO actors (id, character_id, name, link) VALUES (${a.id}, ${a.character_id}, '${a.name}', '${a.link}');`
	// const getInsertSeasonActiveStatement = (s: SeasonActiveDb) => `INSERT INTO seasons (id, actor_id, count) VALUES (${s.id}, ${s.actor_id}, ${s.count});`
	// const getInsertHousesStatement = (h: HousesDb) => `INSERT INTO houses (id, character_id, name) VALUES (${h.id}, ${h.character_id}, '${h.name}');`

	// const insertCharactersStatement = characters.map((c: CharactersDb) => getInsertCharcterStatement(c));
	// const insertRelationshipsStatement = relationships.map((r: RelationshipsDb) => getInsertRelationshipsStatement(r));
	// const insertActionsStatement = actions.map((a: ActionsDb) => getInsertActionsStatement(a));
	// const insertAlliesStatement = allies.map((a: AlliesDb) => getInsertAlliesStatement(a));
	// const insertActorsStatement = actors.map((a: ActorsDb) => getInsertActorsStatement(a));
	// const insertSeasonActiveStatement = seasons.map((s: SeasonActiveDb) => getInsertSeasonActiveStatement(s));
	// const insertHousesStatement = houses.map((h: HousesDb) => getInsertHousesStatement(h));

	// saveDataToFile(insertCharactersStatement, path.join(__dirname, "./sql/characters.sql"));
	// saveDataToFile(insertRelationshipsStatement, path.join(__dirname, "./sql/relationships.sql"));
	// saveDataToFile(insertActionsStatement, path.join(__dirname, "./sql/actions.sql"));
	// saveDataToFile(insertAlliesStatement, path.join(__dirname, "./sql/allies.sql"));
	// saveDataToFile(insertActorsStatement, path.join(__dirname, "./sql/actors.sql"));
	// saveDataToFile(insertSeasonActiveStatement, path.join(__dirname, "./sql/seasons.sql"));
	// saveDataToFile(insertHousesStatement, path.join(__dirname, "./sql/houses.sql"));
}

function saveDataToFile(data: any, filePath: string) {
	// const jsonData = JSON.stringify(data);
	fs.writeFileSync(filePath, data.join('\n'));
}

function saveDataToFileAsJSON(data: any, filePath: string) {
	const jsonData = JSON.stringify(data);
	fs.writeFileSync(filePath, jsonData);
}

// console.log(Object.entries(getCharacters(data.characters)).filter(c => c[1].length > 1));
// saveDataToFile(prepareDbData(data.characters), path.join(__dirname, "./test.json"));
// prepareDbStatements(data.characters);
