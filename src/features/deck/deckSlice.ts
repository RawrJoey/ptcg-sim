import { CardInterface } from '@/components/Card/CardInterface';
import { shuffle } from '@/helpers/deck/shuffle';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface DeckState {
  handCards: CardInterface[],
  discardCards: CardInterface[],
  deckCards: CardInterface[]
};

const initialState: DeckState = {
  handCards: [],
  discardCards: [],
  deckCards: [],
};

export const deckSlice = createSlice({
  name: 'deck',
  initialState,
  reducers: {
    loadDeck: (state, action) => {
      state.deckCards = shuffle(action.payload);
    },
    setupGame: (state) => {
      const openSeven = state.deckCards.slice(state.deckCards.length - 7, state.deckCards.length);
      state.deckCards = state.deckCards.slice(0, state.deckCards.length - 7);
      state.handCards = openSeven;
    },
    drawCard: (state) => {
      const card = state.deckCards[state.deckCards.length - 1];
      state.deckCards.pop();
      state.handCards.push(card);
    },
    discardCard: (state, action: PayloadAction<CardInterface>) => {
      state.handCards = state.handCards.filter((card) => card.id !== action.payload.id);
      state.discardCards.push(action.payload)
    }
  },
})

// Action creators are generated for each case reducer function
export const { loadDeck, setupGame, drawCard, discardCard } = deckSlice.actions

export default deckSlice.reducer;