import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

export interface CardInterface {
  id: number;
  name: string;
  imageUrl: string;
  set: string;
  number: string;
  count?: number;
}

export interface CardObject extends PokemonTCG.Card {
   uuid: string;
   attachments?: CardObject[];
}