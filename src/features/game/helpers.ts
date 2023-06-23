import { CardObject } from "@/components/Card/CardInterface";
import { BatchOfCards } from "@/components/DeckBuild/DeckBuilderModal";
import { parseDeckList } from "@/helpers/deck/parse";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Subtype, Supertype } from "pokemon-tcg-sdk-typescript/dist/sdk";
import { v4 as uuidv4 } from 'uuid';

export const loadDeckList = async (list: string, codeToSetMap: Record<string, string>): Promise<BatchOfCards> => {
  const uniqueCards = parseDeckList(list, codeToSetMap, true);
  const query = uniqueCards.reduce((acc, curr) => {
    const queryStr = `(set.id:${curr.set} number:${curr.number})`;

    if (acc.length === 0) return queryStr;

    return `${acc} OR ${queryStr}`;
  }, '');

  const cards = await PokemonTCG.findCardsByQueries({ q: query});
  const cardBatch: BatchOfCards = {};

  for (const card of uniqueCards) {
    const foundCard = cards.find((apiCard) => apiCard.id === `${card.set}-${card.number}`);

    if (foundCard && card.count) {
      cardBatch[foundCard.id] = {
        count: card.count,
        card: foundCard
      }

    } else {
      console.error('Did not find', card);
    }
  }

  return cardBatch;
}

// TODO: Deprecate
export const loadDeckListIntoCardObjects = async (list: string, codeToSetMap: Record<string, string>): Promise<CardObject[]> => {
  const loadedDeckList = await loadDeckList(list, codeToSetMap);
  const deck = [];

  for (const card of Object.values(loadedDeckList)) {
    for (let idx = 0; idx < (card.count ?? 0); idx++) {
      const cardObj: CardObject = {...card.card, uuid: uuidv4(), energyAttached: [], toolsAttached: [], evolvedPokemonAttached: [] };
      deck.push(cardObj);
    }
  }

  return deck;
}

export const loadSavedDeck = async (deck: BatchOfCards) => {
  const loadedDeck = [];

  for (const cardClump of Object.values(deck)) {
    for (let idx = 0; idx < cardClump.count; idx++) {
      const cardObj: CardObject = {...cardClump.card, uuid: uuidv4(), energyAttached: [], toolsAttached: [], evolvedPokemonAttached: [] };
      loadedDeck.push(cardObj);
    }
  }

  return loadedDeck;
}

export const getAttachmentType = (attachedCard: CardObject) => {
  if (attachedCard.subtypes.includes(Subtype.PokemonTool)) return 'tool';
  if (attachedCard.supertype === Supertype.Energy) return 'energy';
  if (attachedCard.supertype === Supertype.Pokemon && !attachedCard.subtypes.includes(Subtype.Basic)) return 'evolution';

  return null;
}