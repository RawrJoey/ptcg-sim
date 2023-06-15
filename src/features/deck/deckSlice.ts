import { CardInterface, CardObject } from '@/components/Card/CardInterface';
import { CardZone } from '@/components/Card/DraggableCard';
import { parseDeckList } from '@/helpers/deck/parse';
import { shuffle } from '@/helpers/deck/shuffle';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';

interface DeckState {
  handCards: CardObject[],
  discardCards: CardObject[],
  deckCards: CardObject[],
  activePokemon: CardObject | null,
  benchedPokemon: CardObject[],
  stadium: CardObject | null
};

const initialState: DeckState = {
  handCards: [],
  discardCards: [],
  deckCards: [],
  activePokemon: null,
  benchedPokemon: [],
  stadium: null
};

interface MoveCardPayload {
  card: CardObject,
  origin: CardZone,
  destination: CardZone
}

export const deckSlice = createSlice({
  name: 'deck',
  initialState,
  reducers: {
    loadDeck: (state, action: PayloadAction<CardObject[]>) => {
      state.deckCards = shuffle(action.payload);
    },
    setupGame: (state) => {
      const openSeven = state.deckCards.slice(state.deckCards.length - 7, state.deckCards.length);
      state.deckCards = state.deckCards.slice(0, state.deckCards.length - 7);
      state.handCards = openSeven;
    },
    moveCard: (state, action: PayloadAction<MoveCardPayload>) => {
      // Special logic for promoting active
      if (action.payload.origin === 'benched' && action.payload.destination === 'active' && state.activePokemon) {
        state.benchedPokemon = state.benchedPokemon.filter((card) => card.uuid !== action.payload.card.uuid);
        state.benchedPokemon.push(state.activePokemon);
        state.activePokemon = action.payload.card;
        return;
      }
      
      // Special logic for bumping stadium
      if (action.payload.origin === 'hand' && action.payload.destination === 'stadium' && state.stadium) {
        state.handCards = state.handCards.filter((card) => card.uuid !== action.payload.card.uuid);
        state.handCards.push(state.stadium);
        state.stadium = action.payload.card;
        return;
      }

      if (action.payload.origin === 'hand') {
        state.handCards = state.handCards.filter((card) => card.uuid !== action.payload.card.uuid);
      } else if (action.payload.origin === 'deck') {
        state.deckCards = state.deckCards.filter((card) => card.uuid !== action.payload.card.uuid);
      } else if (action.payload.origin === 'discard') {
        state.discardCards = state.discardCards.filter((card) => card.uuid !== action.payload.card.uuid);
      } else if (action.payload.origin === 'active') {
        state.activePokemon = null;
      } else if (action.payload.origin === 'benched') {
        state.benchedPokemon = state.benchedPokemon.filter((card) => card.uuid !== action.payload.card.uuid);
      } else if (action.payload.origin === 'stadium') {
        state.stadium = null;
      }

      if (action.payload.destination === 'hand') {
        state.handCards.push(action.payload.card);
      } else if (action.payload.destination === 'deck') {
        state.deckCards.push(action.payload.card);
      } else if (action.payload.destination === 'discard') {
        state.discardCards.push(action.payload.card);
      } else if (action.payload.destination === 'active') {
        state.activePokemon = action.payload.card;
      } else if (action.payload.destination === 'benched') {
        state.benchedPokemon.push(action.payload.card)
      } else if (action.payload.destination === 'stadium') {
        state.stadium = action.payload.card;
      }
    },
    drawCard: (state) => {
      const card = state.deckCards[state.deckCards.length - 1];
      state.deckCards.pop();
      state.handCards.push(card);
    }
  },
})

// Action creators are generated for each case reducer function
export const { loadDeck, setupGame, moveCard, drawCard } = deckSlice.actions

export default deckSlice.reducer;