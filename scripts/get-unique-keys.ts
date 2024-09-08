import _ from 'lodash';
import data from './got-characters.json'

function getUniqueKeys(data: any) {
    return new Set(data.flatMap((d:any) => Object.keys(d)));
}

console.log(getUniqueKeys(data.characters))