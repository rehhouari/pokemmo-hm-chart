import mons from './clean_monsters.json'
import { getPokemonSpriteUrl } from 'pokenode-ts';
import { hmIds as hms } from '../src/hmmo'

// import {MainClient } from 'pokenode-ts';

// const api = new MainClient();


let hmons: {
  [key: string]: {
    name?: string,
    types?: string[]
    sprite?: string,
    moves: number[]
  }
} = {}

for (const mon of mons as any) {
  if (mon.obtainable != true) continue
  for (const move of mon.moves) {
    if (hms.includes(move.id)) {
      if (move.type != 'TM??') continue
      if (mon.id in hmons) {
        hmons[mon.id].moves.push(move.id)
      } else {
        hmons[mon.id] = { moves: [move.id] }
      }
    }
  }
  if (mon.id in hmons) {
    hmons[mon.id].name = mon.name
    hmons[mon.id].sprite = getPokemonSpriteUrl(mon.id);
    // creating a set ensures types arent duplicated for mons with one type
    // this is due to how monsters.json is built with types always having two.
    hmons[mon.id].types = [...new Set(mon.types)] as string[]
  }
}

// console.table(hmons)

// got lazy to rewrite the above to deal with an array so i just convert to
// an array here. doesnt matter its just a setup script
//@ts-ignore
const hmonsArray = Object.entries(hmons).map(([id, mon]) => ({
  id,
  name: mon.name,
  sprite: mon.sprite,
  types: mon.types,
  moves: mon.moves
}))


// const types = [
//   "normal",
//   "fire",
//   "water",
//   "grass",
//   "electric",
//   "ice",
//   "fighting",
//   "poison",
//   "ground",
//   "flying",
//   "psychic",
//   "bug",
//   "rock",
//   "ghost",
//   "dragon",
//   "dark",
//   "steel"
// ];
// let types_sprites : {[key: string]: string} = {}

// for (const t of types) {
//   let type = await api.pokemon.getTypeByName(t)
//   types_sprites[t] = type.sprites["generation-v"]["black-white"].name_icon!
// }
// Bun.write("types.json", JSON.stringify(types_sprites))

//@ts-ignore
Bun.write("hmons.json", JSON.stringify(hmonsArray))
