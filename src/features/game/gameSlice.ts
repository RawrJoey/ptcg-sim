import { CardObject } from '@/components/Card/CardInterface';
import { CardZone } from '@/components/Card/DraggableCard';
import { shuffle } from '@/helpers/deck/shuffle';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Subtype, Supertype } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import { getAttachmentType } from './helpers';
import { MoveCardPayload } from './types/Card';
import type { DeckState } from './types/Deck';
import { GamePhase, GameState, TurnPhase } from './types/Game';

const initialDeckState: DeckState = {
  handCards: [],
  discardCards: [],
  deckCards: [],
  activePokemon: null,
  benchedPokemon: [],
  stadium: null,
  prizes: []
};

const initialState: GameState = {
  opponentId: null,
  phase: {
    type: 'not-started',
    status: 'ok'
  },
  currentTurnPhase: null,
  myDeck: initialDeckState,
  gameplayActions: []
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
    shuffleDeck: (state) => {
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
      state.gameplayActions.push(action.payload);

      let targetCard = action.payload.card;

      // At start of game, switch phase status to confirm when user chooses active
      if (action.payload.destination.area === 'active' && state.phase.type === 'choose-active') {
        state.phase.status = 'pending-confirm';
      }

      if (state.myDeck.activePokemon && action.payload.origin.area === 'active') {
        // Fix moving attached cards
        targetCard = state.myDeck.activePokemon;
      }

      if (action.payload.origin.area === 'benched') {
        targetCard = state.myDeck.benchedPokemon.find((card) => card.uuid === action.payload.card.uuid) ?? action.payload.card;
      }

      // Handle returning attachments to different zones
      if (action.payload.origin.area === 'active' || action.payload.origin.area === 'benched') {
        // If put to hand, put all attached cards to hand
        if (action.payload.destination.area === 'hand') {
          state.myDeck.handCards = state.myDeck.handCards.concat(targetCard.energyAttached, targetCard.toolsAttached, targetCard.evolvedPokemonAttached);
          targetCard = {
            ...targetCard,
            energyAttached: [],
            toolsAttached: [],
            evolvedPokemonAttached: []
          }
        }

        // If put to discard, put all attached cards to discard
        if (action.payload.destination.area === 'discard') {
          state.myDeck.discardCards = state.myDeck.discardCards.concat(targetCard.energyAttached, targetCard.toolsAttached, targetCard.evolvedPokemonAttached);

          targetCard = {
            ...targetCard,
            energyAttached: [],
            toolsAttached: [],
            evolvedPokemonAttached: []
          }
        }
      }

      // Special logic for bumping stadium
      if (action.payload.origin.area === 'hand' && action.payload.destination.area === 'stadium' && state.myDeck.stadium) {
        state.myDeck.handCards = state.myDeck.handCards.filter((card) => card.uuid !== targetCard.uuid);
        state.myDeck.handCards.push(state.myDeck.stadium);
        state.myDeck.stadium = targetCard;
        return;
      }

      if (action.payload.origin.area === 'hand') {
        state.myDeck.handCards = state.myDeck.handCards.filter((card) => card.uuid !== targetCard.uuid);
      } else if (action.payload.origin.area === 'deck') {
        state.myDeck.deckCards = state.myDeck.deckCards.filter((card) => card.uuid !== targetCard.uuid);
      } else if (action.payload.origin.area === 'discard') {
        state.myDeck.discardCards = state.myDeck.discardCards.filter((card) => card.uuid !== targetCard.uuid);
      } else if (action.payload.origin.area === 'active') {
        state.myDeck.activePokemon = null;
      } else if (action.payload.origin.area === 'benched') {
        state.myDeck.benchedPokemon = state.myDeck.benchedPokemon.filter((card) => card.uuid !== targetCard.uuid);
        if (action.payload.destination.area === 'active' && state.myDeck.activePokemon) {
          state.myDeck.benchedPokemon.push(state.myDeck.activePokemon)
        }
      } else if (action.payload.origin.area === 'stadium') {
        state.myDeck.stadium = null;
      } else if (action.payload.origin.area === 'pokemon') {
        const attachmentType = getAttachmentType(targetCard);

        if (attachmentType === 'energy') {
          if (action.payload.origin.parentArea === 'active' && state.myDeck.activePokemon) {
            state.myDeck.activePokemon.energyAttached = state.myDeck.activePokemon.energyAttached.filter((card) => card.uuid !== targetCard.uuid);
          } else if (action.payload.origin.parentArea === 'benched') {
            const foundBenchedIdx = state.myDeck.benchedPokemon.findIndex((card) => card.energyAttached.some((energy) => energy.uuid === targetCard.uuid));
            state.myDeck.benchedPokemon[foundBenchedIdx].energyAttached = state.myDeck.benchedPokemon[foundBenchedIdx].energyAttached.filter((card) => card.uuid !== targetCard.uuid);
          }
        } else if (attachmentType === 'tool') {
          if (action.payload.origin.parentArea === 'active' && state.myDeck.activePokemon) {
            state.myDeck.activePokemon.toolsAttached = state.myDeck.activePokemon.toolsAttached.filter((card) => card.uuid !== targetCard.uuid);
          } else if (action.payload.origin.parentArea === 'benched') {
            const foundBenchedIdx = state.myDeck.benchedPokemon.findIndex((card) => card.toolsAttached.some((energy) => energy.uuid === targetCard.uuid));
            state.myDeck.benchedPokemon[foundBenchedIdx].toolsAttached = state.myDeck.benchedPokemon[foundBenchedIdx].toolsAttached.filter((card) => card.uuid !== targetCard.uuid);
          }
        } else if (attachmentType === 'evolution') {
          if (action.payload.origin.parentArea === 'active' && state.myDeck.activePokemon) {
            state.myDeck.activePokemon.evolvedPokemonAttached = state.myDeck.activePokemon.evolvedPokemonAttached.filter((card) => card.uuid !== targetCard.uuid);
          } else if (action.payload.origin.parentArea === 'benched') {
            const foundBenchedIdx = state.myDeck.benchedPokemon.findIndex((card) => card.evolvedPokemonAttached.some((energy) => energy.uuid === targetCard.uuid));
            state.myDeck.benchedPokemon[foundBenchedIdx].evolvedPokemonAttached = state.myDeck.benchedPokemon[foundBenchedIdx].evolvedPokemonAttached.filter((card) => card.uuid !== targetCard.uuid);
          }
        }
      } else if (action.payload.origin.area === 'prizes') {
        state.myDeck.prizes = state.myDeck.prizes.filter((card) => card.uuid !== targetCard.uuid);
      }

      if (action.payload.destination.area === 'hand') {
        state.myDeck.handCards.push(targetCard);
      } else if (action.payload.destination.area === 'deck') {
        state.myDeck.deckCards.push(targetCard);
      } else if (action.payload.destination.area === 'discard') {
        state.myDeck.discardCards.push(targetCard);
      } else if (action.payload.destination.area === 'active') {
        state.myDeck.activePokemon = targetCard;
      } else if (action.payload.destination.area === 'benched') {
        state.myDeck.benchedPokemon.push(targetCard)
      } else if (action.payload.destination.area === 'stadium') {
        state.myDeck.stadium = targetCard;
      } else if (action.payload.destination.area === 'pokemon') {
        if (
          action.payload.destination.metadata &&
          state.myDeck.activePokemon &&
          action.payload.destination.parentArea === 'active')
        {
          const attachmentType = getAttachmentType(targetCard);
          if (attachmentType === 'tool') {
            state.myDeck.activePokemon.toolsAttached.push(targetCard);
          } else if (attachmentType === 'energy') {
            state.myDeck.activePokemon.energyAttached.push(targetCard);
          } else if (attachmentType === 'evolution') {
            state.myDeck.activePokemon.evolvedPokemonAttached.push(targetCard);
          }
        } else if (
          action.payload.destination.metadata &&
          action.payload.destination.parentArea === 'benched')
        {
          console.log(action.payload.destination.metadata?.uuid)
          const draggedOntoPokemonIdx = state.myDeck.benchedPokemon.findIndex((card) => card.uuid === action.payload.destination.metadata?.uuid);

          if (draggedOntoPokemonIdx < 0) return console.error('Dragged onto pokemonIdx not found. Not attaching.');

          const attachmentType = getAttachmentType(targetCard);
          if (attachmentType === 'tool') {
            state.myDeck.benchedPokemon[draggedOntoPokemonIdx].toolsAttached.push(targetCard);
          } else if (attachmentType === 'energy') {
            state.myDeck.benchedPokemon[draggedOntoPokemonIdx].energyAttached.push(targetCard);
          } else if (attachmentType === 'evolution') {
            state.myDeck.benchedPokemon[draggedOntoPokemonIdx].evolvedPokemonAttached.push(targetCard);
          }
        }
      }

      // At the end, if we came from deck - shuffle deck
      if (action.payload.origin.area === 'deck') {
        state.myDeck.deckCards = shuffle(state.myDeck.deckCards);
      }
    },
    drawCard: (state) => {
      const card = state.myDeck.deckCards.at(state.myDeck.deckCards.length - 1);
      state.myDeck.deckCards.pop();
      if (!card) return console.error('card is undefined')
      state.myDeck.handCards.push(card);
    },
    takePrize: (state, action: PayloadAction<number>) => {
      state.myDeck.handCards.push(state.myDeck.prizes[action.payload]);
      state.myDeck.prizes = [
        ...state.myDeck.prizes.slice(0, action.payload),
        ...state.myDeck.prizes.slice(action.payload + 1)
      ]
    }
  },
})

// Action creators are generated for each case reducer function
export const { setGamePhase, loadDeck, shuffleDeck, drawOpenSeven, moveCard, drawCard, mulliganHandAway, checkForBasic, layPrizes, takePrize } = gameSlice.actions

export default gameSlice.reducer;