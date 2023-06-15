import { CardObject } from '@/components/Card/CardInterface';
import { CardZone } from '@/components/Card/DraggableCard';
import { shuffle } from '@/helpers/deck/shuffle';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Subtype, Supertype } from 'pokemon-tcg-sdk-typescript/dist/sdk';

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
  destination: CardZone,
  destinationMetadata?: CardObject;
}

export type GamePhaseType = 'initialize' | 'initial-draw' | 'mulligan' | 'choose-active' | 'lay-prizes' | 'your-turn' | 'opponent-turn' | 'game-end';
export type GamePhaseStatus = 'ok' | 'pending-user-input' | 'pending-confirm';

export interface GamePhase {
  type: GamePhaseType,
  status: GamePhaseStatus
}

export type TurnPhase = 'draw' | 'main' | 'attack' | 'apply-damage' | 'take-prize' | 'end';

interface GameState {
  phase: GamePhase,
  currentTurnPhase: TurnPhase | null,
  myDeck: DeckState
};

const initialState: GameState = {
  phase: {
    type: 'initialize',
    status: 'ok'
  },
  currentTurnPhase: null,
  myDeck: initialDeckState
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGamePhase: (state, action: PayloadAction<GamePhase>) => {
      state.phase = action.payload;
    },
    loadDeck: (state, action: PayloadAction<CardObject[]>) => {
      state.myDeck.deckCards = shuffle(action.payload);
    },
    mulliganHandAway: (state) => {
      state.myDeck.deckCards.concat(state.myDeck.handCards);
      state.myDeck.handCards = [];
      state.myDeck.deckCards = shuffle(state.myDeck.deckCards);
    },
    drawOpenSeven: (state) => {
      const openSeven = state.myDeck.deckCards.slice(state.myDeck.deckCards.length - 7, state.myDeck.deckCards.length);
      state.myDeck.deckCards = state.myDeck.deckCards.slice(0, state.myDeck.deckCards.length - 7);
      state.myDeck.handCards = openSeven;
    },
    checkForBasic: (state) => {
      const shouldMulligan = !state.myDeck.handCards.some((card: CardObject) => card.supertype === Supertype.Pokemon && card.subtypes.includes(Subtype.Basic));
      if (shouldMulligan) {
        state.phase = {
          type: 'mulligan',
          status: 'pending-confirm'
        }
      } else {
        state.phase = {
          type: 'choose-active',
          status: 'pending-user-input'
        }
      }
    },
    layPrizes: (state) => {
      const prizes = state.myDeck.deckCards.slice(state.myDeck.deckCards.length - 6, state.myDeck.deckCards.length);
      state.myDeck.deckCards = state.myDeck.deckCards.slice(0, state.myDeck.deckCards.length - 6);
      state.myDeck.prizes = prizes;
    },
    moveCard: (state, action: PayloadAction<MoveCardPayload>) => {
      // At start of game, switch phase status to confirm when user chooses active
      if (action.payload.destination === 'active' && state.phase.type === 'choose-active') {
        state.phase.status = 'pending-confirm';
      }

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
      const card = state.myDeck.deckCards.at(state.myDeck.deckCards.length - 1);
      state.myDeck.deckCards.pop();
      if (!card) return console.error('card is undefined')
      state.myDeck.handCards.push(card);
    }
  },
})

// Action creators are generated for each case reducer function
export const { setGamePhase, loadDeck, drawOpenSeven, moveCard, drawCard, mulliganHandAway, checkForBasic, layPrizes } = gameSlice.actions

export default gameSlice.reducer;