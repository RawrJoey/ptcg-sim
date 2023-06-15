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
};

const initialState: DeckState = {
  handCards: [],
  discardCards: [],
  deckCards: [],
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
      if (action.payload.origin === 'hand') {
        state.handCards = state.handCards.filter((card) => card.uuid !== action.payload.card.uuid);
      } else if (action.payload.origin === 'deck') {
        state.deckCards = state.deckCards.filter((card) => card.uuid !== action.payload.card.uuid);
      } else if (action.payload.origin === 'discard') {
        state.discardCards = state.discardCards.filter((card) => card.uuid !== action.payload.card.uuid);
      }

      if (action.payload.destination === 'hand') {
        state.handCards.push(action.payload.card);
      } else if (action.payload.destination === 'deck') {
        state.deckCards.push(action.payload.card);
      } else if (action.payload.destination === 'discard') {
        state.discardCards.push(action.payload.card);
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