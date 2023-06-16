import { CardObject } from "@/components/Card/CardInterface";

export interface DeckState {
  handCards: CardObject[],
  discardCards: CardObject[],
  deckCards: CardObject[],
  activePokemon: CardObject | null,
  benchedPokemon: CardObject[],
  stadium: CardObject | null,
  prizes: CardObject[]
};