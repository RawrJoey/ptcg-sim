import { CardObject } from '@/components/Card/CardInterface';
import { CardZone } from '@/components/Card/DraggableCard';
import { shuffle } from '@/helpers/deck/shuffle';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface DeckState {
  handCards: CardObject[],
  discardCards: CardObject[],
  deckCards: CardObject[],
  activePokemon: CardObject | null,
  benchedPokemon: CardObject[],
  stadium: CardObject | null,
  prizes: CardObject[]
};

const initialDeckState: DeckState = {
  handCards: [],
  discardCards: [],
  deckCards: [],
  activePokemon: null,
  benchedPokemon: [],
  stadium: null,
  prizes: []
};

interface MoveCardPayload {
  card: CardObject,
  origin: CardZone,
  destination: CardZone
}

export type GamePhase = 'initial-draw' | 'mulligan' | 'choose-active' | 'your-turn' | 'opponent-turn' | 'game-end';

export type TurnPhase = 'draw' | 'main' | 'attack' | 'apply-damage' | 'take-prize' | 'end';

interface GameState {
  phase: GamePhase,
  currentTurnPhase: TurnPhase | null,
  myDeck: DeckState
};

const initialState: GameState = {
  phase: 'initial-draw',
  currentTurnPhase: null,
  myDeck: initialDeckState
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    loadDeck: (state, action: PayloadAction<CardObject[]>) => {
      state.myDeck.deckCards = shuffle(action.payload);
    },
    setupGame: (state) => {
      const openSeven = state.myDeck.deckCards.slice(state.myDeck.deckCards.length - 7, state.myDeck.deckCards.length);
      state.myDeck.deckCards = state.myDeck.deckCards.slice(0, state.myDeck.deckCards.length - 7);
      state.myDeck.handCards = openSeven;
    },
    layPrizes: (state) => {
      const prizes = state.myDeck.deckCards.slice(state.myDeck.deckCards.length - 6, state.myDeck.deckCards.length);
      state.myDeck.deckCards = state.myDeck.deckCards.slice(0, state.myDeck.deckCards.length - 6);
      state.myDeck.prizes = prizes;
    },
    moveCard: (state, action: PayloadAction<MoveCardPayload>) => {
      // Special logic for promoting active
      if (action.payload.origin === 'benched' && action.payload.destination === 'active' && state.myDeck.activePokemon) {
        state.myDeck.benchedPokemon = state.myDeck.benchedPokemon.filter((card) => card.uuid !== action.payload.card.uuid);
        state.myDeck.benchedPokemon.push(state.myDeck.activePokemon);
        state.myDeck.activePokemon = action.payload.card;
        return;
      }
      
      // Special logic for bumping stadium
      if (action.payload.origin === 'hand' && action.payload.destination === 'stadium' && state.myDeck.stadium) {
        state.myDeck.handCards = state.myDeck.handCards.filter((card) => card.uuid !== action.payload.card.uuid);
        state.myDeck.handCards.push(state.myDeck.stadium);
        state.myDeck.stadium = action.payload.card;
        return;
      }

      if (action.payload.origin === 'hand') {
        state.myDeck.handCards = state.myDeck.handCards.filter((card) => card.uuid !== action.payload.card.uuid);
      } else if (action.payload.origin === 'deck') {
        state.myDeck.deckCards = state.myDeck.deckCards.filter((card) => card.uuid !== action.payload.card.uuid);
      } else if (action.payload.origin === 'discard') {
        state.myDeck.discardCards = state.myDeck.discardCards.filter((card) => card.uuid !== action.payload.card.uuid);
      } else if (action.payload.origin === 'active') {
        state.myDeck.activePokemon = null;
      } else if (action.payload.origin === 'benched') {
        state.myDeck.benchedPokemon = state.myDeck.benchedPokemon.filter((card) => card.uuid !== action.payload.card.uuid);
      } else if (action.payload.origin === 'stadium') {
        state.myDeck.stadium = null;
      }

      if (action.payload.destination === 'hand') {
        state.myDeck.handCards.push(action.payload.card);
      } else if (action.payload.destination === 'deck') {
        state.myDeck.deckCards.push(action.payload.card);
      } else if (action.payload.destination === 'discard') {
        state.myDeck.discardCards.push(action.payload.card);
      } else if (action.payload.destination === 'active') {
        state.myDeck.activePokemon = action.payload.card;
      } else if (action.payload.destination === 'benched') {
        state.myDeck.benchedPokemon.push(action.payload.card)
      } else if (action.payload.destination === 'stadium') {
        state.myDeck.stadium = action.payload.card;
      }
    },
    drawCard: (state) => {
      const card = state.myDeck.deckCards[state.myDeck.deckCards.length - 1];
      state.myDeck.deckCards.pop();
      state.myDeck.handCards.push(card);
    }
  },
})

// Action creators are generated for each case reducer function
export const { loadDeck, setupGame, moveCard, drawCard } = gameSlice.actions

export default gameSlice.reducer;