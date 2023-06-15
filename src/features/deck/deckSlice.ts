import { CardInterface } from '@/components/Card/CardInterface';
import { CardZone } from '@/components/Card/DraggableCard';
import { parseDeckList } from '@/helpers/deck/parse';
import { shuffle } from '@/helpers/deck/shuffle';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';

interface DeckState {
  handCards: PokemonTCG.Card[],
  discardCards: PokemonTCG.Card[],
  deckCards: PokemonTCG.Card[],
};

const initialState: DeckState = {
  handCards: [],
  discardCards: [],
  deckCards: [],
};

interface MoveCardPayload {
  card: PokemonTCG.Card,
  origin: CardZone,
  destination: CardZone
}

export const deckSlice = createSlice({
  name: 'deck',
  initialState,
  reducers: {
    loadDeck: (state, action: PayloadAction<PokemonTCG.Card[]>) => {
      state.deckCards = shuffle(action.payload);
    },
    setupGame: (state) => {
      const openSeven = state.deckCards.slice(state.deckCards.length - 7, state.deckCards.length);
      state.deckCards = state.deckCards.slice(0, state.deckCards.length - 7);
      state.handCards = openSeven;
    },
    moveCard: (state, action: PayloadAction<MoveCardPayload>) => {
      if (action.payload.origin === 'hand') {
        state.handCards = state.handCards.filter((card) => card.id !== action.payload.card.id);
      } else if (action.payload.origin === 'deck') {
        state.deckCards = state.deckCards.filter((card) => card.id !== action.payload.card.id);
      } else if (action.payload.origin === 'discard') {
        state.discardCards = state.discardCards.filter((card) => card.id !== action.payload.card.id);
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