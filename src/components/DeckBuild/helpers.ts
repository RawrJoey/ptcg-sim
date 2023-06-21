import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { BatchOfCards } from "./DeckBuilderModal";

export const getTrueCardCount = (cards: BatchOfCards, card: PokemonTCG.Card) => {
  return Object.values(cards).reduce((acc: number, curr) => {
    if (curr.card.name === card.name) return acc + curr.count;
    return acc;
  }, 0);
}

export const getDeckLength = (cards: BatchOfCards) => {
  return Object.values(cards).reduce((acc, curr) => acc + curr.count, 0);
}