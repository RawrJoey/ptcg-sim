import { CardObject } from '@/components/Card/CardInterface';
import { CardZone } from '@/components/Card/DraggableCard';
import { shuffle } from '@/helpers/deck/shuffle';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Subtype, Supertype } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import { getAttachmentType } from './helpers';

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
      if (action.payload.destination.area === 'active' && state.phase.type === 'choose-active') {
        state.phase.status = 'pending-confirm';
      }

      // Special logic for promoting active
      if (action.payload.origin.area === 'benched' && action.payload.destination.area === 'active' && state.myDeck.activePokemon) {
        state.myDeck.benchedPokemon = state.myDeck.benchedPokemon.filter((card) => card.uuid !== action.payload.card.uuid);
        state.myDeck.benchedPokemon.push(state.myDeck.activePokemon);
        state.myDeck.activePokemon = action.payload.card;
        return;
      }

      // Special logic for bumping stadium
      if (action.payload.origin.area === 'hand' && action.payload.destination.area === 'stadium' && state.myDeck.stadium) {
        state.myDeck.handCards = state.myDeck.handCards.filter((card) => card.uuid !== action.payload.card.uuid);
        state.myDeck.handCards.push(state.myDeck.stadium);
        state.myDeck.stadium = action.payload.card;
        return;
      }

      if (action.payload.origin.area === 'hand') {
        state.myDeck.handCards = state.myDeck.handCards.filter((card) => card.uuid !== action.payload.card.uuid);
      } else if (action.payload.origin.area === 'deck') {
        state.myDeck.deckCards = state.myDeck.deckCards.filter((card) => card.uuid !== action.payload.card.uuid);
      } else if (action.payload.origin.area === 'discard') {
        state.myDeck.discardCards = state.myDeck.discardCards.filter((card) => card.uuid !== action.payload.card.uuid);
      } else if (action.payload.origin.area === 'active') {
        state.myDeck.activePokemon = null;
      } else if (action.payload.origin.area === 'benched') {
        state.myDeck.benchedPokemon = state.myDeck.benchedPokemon.filter((card) => card.uuid !== action.payload.card.uuid);
      } else if (action.payload.origin.area === 'stadium') {
        state.myDeck.stadium = null;
      }

      if (action.payload.destination.area === 'hand') {
        state.myDeck.handCards.push(action.payload.card);
      } else if (action.payload.destination.area === 'deck') {
        state.myDeck.deckCards.push(action.payload.card);
      } else if (action.payload.destination.area === 'discard') {
        state.myDeck.discardCards.push(action.payload.card);
      } else if (action.payload.destination.area === 'active') {
        state.myDeck.activePokemon = action.payload.card;
      } else if (action.payload.destination.area === 'benched') {
        state.myDeck.benchedPokemon.push(action.payload.card)
      } else if (action.payload.destination.area === 'stadium') {
        state.myDeck.stadium = action.payload.card;
      } else if (action.payload.destination.area === 'pokemon') {
        if (
          action.payload.destination.metadata &&
          state.myDeck.activePokemon &&
          action.payload.destination.parentArea === 'active')
        {
          const attachmentType = getAttachmentType(action.payload.card);
          if (attachmentType === 'tool') {
            state.myDeck.activePokemon.toolsAttached.push(action.payload.card);
          } else if (attachmentType === 'energy') {
            state.myDeck.activePokemon.energyAttached.push(action.payload.card);
          } else if (attachmentType === 'evolution') {
            state.myDeck.activePokemon.evolvedPokemonAttached.push(action.payload.card);
          }
        } else if (
          action.payload.destination.metadata &&
          action.payload.destination.parentArea === 'benched')
        {
          const draggedOntoPokemonIdx = state.myDeck.benchedPokemon.findIndex((card) => card.uuid === action.payload.destination.metadata?.uuid);

          if (!draggedOntoPokemonIdx) return console.error('Dragged onto pokemonIdx not found. Not attaching.');

          const attachmentType = getAttachmentType(action.payload.card);
          if (attachmentType === 'tool') {
            state.myDeck.benchedPokemon[draggedOntoPokemonIdx].toolsAttached.push(action.payload.card);
          } else if (attachmentType === 'energy') {
            state.myDeck.benchedPokemon[draggedOntoPokemonIdx].energyAttached.push(action.payload.card);
          } else if (attachmentType === 'evolution') {
            state.myDeck.benchedPokemon[draggedOntoPokemonIdx].evolvedPokemonAttached.push(action.payload.card);
          }
        }
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