import { CardObject } from "@/components/Card/CardInterface";
import { parseDeckList } from "@/helpers/deck/parse";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { v4 as uuidv4 } from 'uuid';

export const loadDeckList = async (list: string, codeToSetMap: Record<string, string>): Promise<CardObject[]> => {
  const uniqueCards = parseDeckList(list, codeToSetMap, true);
  const query = uniqueCards.reduce((acc, curr) => {
    const queryStr = `(set.id:${curr.set} number:${curr.number})`;

    if (acc.length === 0) return queryStr;

    return `${acc} OR ${queryStr}`;
  }, '');

 const cards = await PokemonTCG.findCardsByQueries({ q: query});
 const deck = [];

 for (const card of uniqueCards) {
   const foundCard = cards.find((apiCard) => apiCard.id === `${card.set}-${card.number}`);

   if (foundCard) {
     for (let idx = 0; idx < (card.count ?? 0); idx++) {
       deck.push({...foundCard, uuid: uuidv4()});
     }
   }
 }

 return deck;
}