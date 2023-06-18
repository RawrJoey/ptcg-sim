import { CardObject } from '@/components/Card/CardInterface';
import { CardZone } from '@/components/Card/DraggableCard';
import { shuffle } from '@/helpers/deck/shuffle';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Subtype, Supertype } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import { getAttachmentType } from './helpers';
import type { DeckState } from './types/Deck';
import { GamePhase, GamePhaseState, GameState, TurnPhase } from './types/Game';
import { MoveCardPayload } from './types/GameplayActions';

import { produce } from 'immer';

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
  phase: {
    type: 'not-started',
    status: 'pending',
    acked: false
  },
  opponentPhase: {
    type: 'not-started',
    status: 'pending',
    acked: false
  },
  currentTurnPhase: null,
  myDeck: initialDeckState,
  opponentDeck: initialDeckState,
  gameplayActions: [],
  acks: []
};

export interface GamePayload<T> {
  isOpponent?: boolean;
  payload: T;
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGamePhase: produce((state, action: PayloadAction<GamePhase>) => {
      state.gameplayActions.push({ type: 'game/setGamePhase', payload: action.payload });

      state.phase = {
        ...action.payload,
        acked: false
      };
    }),
    setOpponentPhase: produce((state, action: PayloadAction<GamePhaseState>) => {
      state.opponentPhase = action.payload;
    }),
    queueAckToSend: produce((state, action: PayloadAction<GamePhase>) => {
      state.gameplayActions.push({ type: 'game/queueAckToSend', payload: action.payload });
    }),
    acknowledgePhaseChangeWasReceived: produce((state) => {
      state.phase = {
        ...state.phase,
        acked: true
      };
    }),
    loadDeck: produce((state, action: PayloadAction<GamePayload<CardObject[]>>) => {
      !action.payload.isOpponent && state.gameplayActions.push({ type: 'game/loadDeck', payload: action.payload.payload });

      (action.payload.isOpponent ? state.opponentDeck : state.myDeck).deckCards = shuffle(action.payload.payload);
    }),
    mulliganHandAway: produce((state) => {
      state.gameplayActions.push({ type: 'game/mulliganHandAway' });

      state.myDeck.deckCards.concat(state.myDeck.handCards);
      state.myDeck.handCards = [];
      state.myDeck.deckCards = shuffle(state.myDeck.deckCards);
    }),
    shuffleDeck: produce((state) => {
      state.gameplayActions.push({ type: 'game/shuffleDeck' });

      state.myDeck.deckCards = shuffle(state.myDeck.deckCards);
    }),
    drawOpenSeven: produce((state, action: PayloadAction<GamePayload<undefined>>) => {
      state.gameplayActions.push({ type: 'game/drawOpenSeven' });

      const openSeven = (action.payload.isOpponent ? state.opponentDeck : state.myDeck).deckCards.slice((action.payload.isOpponent ? state.opponentDeck : state.myDeck).deckCards.length - 7, (action.payload.isOpponent ? state.opponentDeck : state.myDeck).deckCards.length);
      (action.payload.isOpponent ? state.opponentDeck : state.myDeck).deckCards = (action.payload.isOpponent ? state.opponentDeck : state.myDeck).deckCards.slice(0, (action.payload.isOpponent ? state.opponentDeck : state.myDeck).deckCards.length - 7);
      (action.payload.isOpponent ? state.opponentDeck : state.myDeck).handCards = openSeven;
    }),
    layPrizes: produce((state, action: PayloadAction<GamePayload<undefined>>) => {
      !action.payload.isOpponent && state.gameplayActions.push({ type: 'game/layPrizes' });
      
      const prizes = (action.payload.isOpponent ? state.opponentDeck : state.myDeck).deckCards.slice((action.payload.isOpponent ? state.opponentDeck : state.myDeck).deckCards.length - 6, (action.payload.isOpponent ? state.opponentDeck : state.myDeck).deckCards.length);
      (action.payload.isOpponent ? state.opponentDeck : state.myDeck).deckCards = (action.payload.isOpponent ? state.opponentDeck : state.myDeck).deckCards.slice(0, (action.payload.isOpponent ? state.opponentDeck : state.myDeck).deckCards.length - 6);
      (action.payload.isOpponent ? state.opponentDeck : state.myDeck).prizes = prizes;
    }),
    moveCard: produce((state, action: PayloadAction<GamePayload<MoveCardPayload>>) => {
      !action.payload.isOpponent && state.gameplayActions.push({ type: 'game/moveCard', payload: action.payload.payload });

      let targetCard = action.payload.payload.card;

      // At start of game, switch phase status to confirm when user chooses active
      if (action.payload.payload.destination.area === 'active' && state.phase.type === 'choose-active') {
        state.phase.status = 'pending';
      }

      if ((action.payload.isOpponent ? state.opponentDeck : state.myDeck).activePokemon && action.payload.payload.origin.area === 'active') {
        // Fix moving attached cards
        targetCard = (action.payload.isOpponent ? state.opponentDeck : state.myDeck).activePokemon as CardObject;
      }

      if (action.payload.payload.origin.area === 'benched') {
        targetCard = (action.payload.isOpponent ? state.opponentDeck : state.myDeck).benchedPokemon.find((card) => card.uuid === action.payload.payload.card.uuid) ?? action.payload.payload.card;
      }

      // Handle returning attachments to different zones
      if (action.payload.payload.origin.area === 'active' || action.payload.payload.origin.area === 'benched') {
        // If put to hand, put all attached cards to hand
        if (action.payload.payload.destination.area === 'hand') {
          (action.payload.isOpponent ? state.opponentDeck : state.myDeck).handCards = (action.payload.isOpponent ? state.opponentDeck : state.myDeck).handCards.concat(targetCard.energyAttached, targetCard.toolsAttached, targetCard.evolvedPokemonAttached);
          targetCard = {
            ...targetCard,
            energyAttached: [],
            toolsAttached: [],
            evolvedPokemonAttached: []
          }
        }

        // If put to discard, put all attached cards to discard
        if (action.payload.payload.destination.area === 'discard') {
          (action.payload.isOpponent ? state.opponentDeck : state.myDeck).discardCards = (action.payload.isOpponent ? state.opponentDeck : state.myDeck).discardCards.concat(targetCard.energyAttached, targetCard.toolsAttached, targetCard.evolvedPokemonAttached);

          targetCard = {
            ...targetCard,
            energyAttached: [],
            toolsAttached: [],
            evolvedPokemonAttached: []
          }
        }
      }

      // Special logic for bumping stadium
      if (action.payload.payload.origin.area === 'hand' && action.payload.payload.destination.area === 'stadium' && (action.payload.isOpponent ? state.opponentDeck : state.myDeck).stadium) {
        (action.payload.isOpponent ? state.opponentDeck : state.myDeck).handCards = (action.payload.isOpponent ? state.opponentDeck : state.myDeck).handCards.filter((card) => card.uuid !== targetCard.uuid);
        (action.payload.isOpponent ? state.opponentDeck : state.myDeck).handCards.push((action.payload.isOpponent ? state.opponentDeck : state.myDeck).stadium as CardObject);
        (action.payload.isOpponent ? state.opponentDeck : state.myDeck).stadium = targetCard;
        return;
      }

      if (action.payload.payload.origin.area === 'hand') {
        (action.payload.isOpponent ? state.opponentDeck : state.myDeck).handCards = (action.payload.isOpponent ? state.opponentDeck : state.myDeck).handCards.filter((card) => card.uuid !== targetCard.uuid);
      } else if (action.payload.payload.origin.area === 'deck') {
        (action.payload.isOpponent ? state.opponentDeck : state.myDeck).deckCards = (action.payload.isOpponent ? state.opponentDeck : state.myDeck).deckCards.filter((card) => card.uuid !== targetCard.uuid);
      } else if (action.payload.payload.origin.area === 'discard') {
        (action.payload.isOpponent ? state.opponentDeck : state.myDeck).discardCards = (action.payload.isOpponent ? state.opponentDeck : state.myDeck).discardCards.filter((card) => card.uuid !== targetCard.uuid);
      } else if (action.payload.payload.origin.area === 'active') {
        (action.payload.isOpponent ? state.opponentDeck : state.myDeck).activePokemon = null;
      } else if (action.payload.payload.origin.area === 'benched') {
        (action.payload.isOpponent ? state.opponentDeck : state.myDeck).benchedPokemon = (action.payload.isOpponent ? state.opponentDeck : state.myDeck).benchedPokemon.filter((card) => card.uuid !== targetCard.uuid);
        if (action.payload.payload.destination.area === 'active' && (action.payload.isOpponent ? state.opponentDeck : state.myDeck).activePokemon) {
          (action.payload.isOpponent ? state.opponentDeck : state.myDeck).benchedPokemon.push((action.payload.isOpponent ? state.opponentDeck : state.myDeck).activePokemon as CardObject)
        }
      } else if (action.payload.payload.origin.area === 'stadium') {
        (action.payload.isOpponent ? state.opponentDeck : state.myDeck).stadium = null;
      } else if (action.payload.payload.origin.area === 'pokemon') {
        const attachmentType = getAttachmentType(targetCard);

        if (attachmentType === 'energy') {
          if (action.payload.payload.origin.parentArea === 'active' && (action.payload.isOpponent ? state.opponentDeck : state.myDeck).activePokemon) {
            ((action.payload.isOpponent ? state.opponentDeck : state.myDeck).activePokemon as CardObject).energyAttached = ((action.payload.isOpponent ? state.opponentDeck : state.myDeck ).activePokemon as CardObject).energyAttached.filter((card) => card.uuid !== targetCard.uuid);
          } else if (action.payload.payload.origin.parentArea === 'benched') {
            const foundBenchedIdx = (action.payload.isOpponent ? state.opponentDeck : state.myDeck).benchedPokemon.findIndex((card) => card.energyAttached.some((energy) => energy.uuid === targetCard.uuid));
            (action.payload.isOpponent ? state.opponentDeck : state.myDeck).benchedPokemon[foundBenchedIdx].energyAttached = (action.payload.isOpponent ? state.opponentDeck : state.myDeck).benchedPokemon[foundBenchedIdx].energyAttached.filter((card) => card.uuid !== targetCard.uuid);
          }
        } else if (attachmentType === 'tool') {
          if (action.payload.payload.origin.parentArea === 'active' && (action.payload.isOpponent ? state.opponentDeck : state.myDeck).activePokemon) {
            ((action.payload.isOpponent ? state.opponentDeck : state.myDeck).activePokemon as CardObject).toolsAttached = ((action.payload.isOpponent ? state.opponentDeck : state.myDeck).activePokemon as CardObject).toolsAttached.filter((card) => card.uuid !== targetCard.uuid);
          } else if (action.payload.payload.origin.parentArea === 'benched') {
            const foundBenchedIdx = (action.payload.isOpponent ? state.opponentDeck : state.myDeck).benchedPokemon.findIndex((card) => card.toolsAttached.some((energy) => energy.uuid === targetCard.uuid));
            (action.payload.isOpponent ? state.opponentDeck : state.myDeck).benchedPokemon[foundBenchedIdx].toolsAttached = (action.payload.isOpponent ? state.opponentDeck : state.myDeck).benchedPokemon[foundBenchedIdx].toolsAttached.filter((card) => card.uuid !== targetCard.uuid);
          }
        } else if (attachmentType === 'evolution') {
          if (action.payload.payload.origin.parentArea === 'active' && (action.payload.isOpponent ? state.opponentDeck : state.myDeck).activePokemon) {
            ((action.payload.isOpponent ? state.opponentDeck : state.myDeck).activePokemon as CardObject).evolvedPokemonAttached = ((action.payload.isOpponent ? state.opponentDeck : state.myDeck).activePokemon as CardObject).evolvedPokemonAttached.filter((card) => card.uuid !== targetCard.uuid);
          } else if (action.payload.payload.origin.parentArea === 'benched') {
            const foundBenchedIdx = (action.payload.isOpponent ? state.opponentDeck : state.myDeck).benchedPokemon.findIndex((card) => card.evolvedPokemonAttached.some((energy) => energy.uuid === targetCard.uuid));
            (action.payload.isOpponent ? state.opponentDeck : state.myDeck).benchedPokemon[foundBenchedIdx].evolvedPokemonAttached = (action.payload.isOpponent ? state.opponentDeck : state.myDeck).benchedPokemon[foundBenchedIdx].evolvedPokemonAttached.filter((card) => card.uuid !== targetCard.uuid);
          }
        }
      } else if (action.payload.payload.origin.area === 'prizes') {
        (action.payload.isOpponent ? state.opponentDeck : state.myDeck).prizes = (action.payload.isOpponent ? state.opponentDeck : state.myDeck).prizes.filter((card) => card.uuid !== targetCard.uuid);
      }

      if (action.payload.payload.destination.area === 'hand') {
        (action.payload.isOpponent ? state.opponentDeck : state.myDeck).handCards.push(targetCard);
      } else if (action.payload.payload.destination.area === 'deck') {
        (action.payload.isOpponent ? state.opponentDeck : state.myDeck).deckCards.push(targetCard);
      } else if (action.payload.payload.destination.area === 'discard') {
        (action.payload.isOpponent ? state.opponentDeck : state.myDeck).discardCards.push(targetCard);
      } else if (action.payload.payload.destination.area === 'active') {
        (action.payload.isOpponent ? state.opponentDeck : state.myDeck).activePokemon = targetCard;
      } else if (action.payload.payload.destination.area === 'benched') {
        (action.payload.isOpponent ? state.opponentDeck : state.myDeck).benchedPokemon.push(targetCard)
      } else if (action.payload.payload.destination.area === 'stadium') {
        (action.payload.isOpponent ? state.opponentDeck : state.myDeck).stadium = targetCard;
      } else if (action.payload.payload.destination.area === 'pokemon') {
        if (
          action.payload.payload.destination.metadata &&
          (action.payload.isOpponent ? state.opponentDeck : state.myDeck).activePokemon &&
          action.payload.payload.destination.parentArea === 'active')
        {
          const attachmentType = getAttachmentType(targetCard);
          if (attachmentType === 'tool') {
            ((action.payload.isOpponent ? state.opponentDeck : state.myDeck).activePokemon as CardObject).toolsAttached.push(targetCard);
          } else if (attachmentType === 'energy') {
            ((action.payload.isOpponent ? state.opponentDeck : state.myDeck).activePokemon as CardObject).energyAttached.push(targetCard);
          } else if (attachmentType === 'evolution') {
            ((action.payload.isOpponent ? state.opponentDeck : state.myDeck).activePokemon as CardObject).evolvedPokemonAttached.push(targetCard);
          }
        } else if (
          action.payload.payload.destination.metadata &&
          action.payload.payload.destination.parentArea === 'benched')
        {
          console.log(action.payload.payload.destination.metadata?.uuid)
          const draggedOntoPokemonIdx = (action.payload.isOpponent ? state.opponentDeck : state.myDeck).benchedPokemon.findIndex((card) => card.uuid === action.payload.payload.destination.metadata?.uuid);

          if (draggedOntoPokemonIdx < 0) return console.error('Dragged onto pokemonIdx not found. Not attaching.');

          const attachmentType = getAttachmentType(targetCard);
          if (attachmentType === 'tool') {
            (action.payload.isOpponent ? state.opponentDeck : state.myDeck).benchedPokemon[draggedOntoPokemonIdx].toolsAttached.push(targetCard);
          } else if (attachmentType === 'energy') {
            (action.payload.isOpponent ? state.opponentDeck : state.myDeck).benchedPokemon[draggedOntoPokemonIdx].energyAttached.push(targetCard);
          } else if (attachmentType === 'evolution') {
            (action.payload.isOpponent ? state.opponentDeck : state.myDeck).benchedPokemon[draggedOntoPokemonIdx].evolvedPokemonAttached.push(targetCard);
          }
        }
      }

      // At the end, if we came from deck - shuffle deck
      if (action.payload.payload.origin.area === 'deck') {
        (action.payload.isOpponent ? state.opponentDeck : state.myDeck).deckCards = shuffle((action.payload.isOpponent ? state.opponentDeck : state.myDeck).deckCards);
      }
    }),
    drawCard: produce((state, action: PayloadAction<GamePayload<undefined>>) => {
      !action.payload.isOpponent && state.gameplayActions.push({ type: 'game/drawCard' });

      const card = (action.payload.isOpponent ? state.opponentDeck : state.myDeck).deckCards.at((action.payload.isOpponent ? state.opponentDeck : state.myDeck).deckCards.length - 1);
      (action.payload.isOpponent ? state.opponentDeck : state.myDeck).deckCards.pop();
      if (!card) return;
      (action.payload.isOpponent ? state.opponentDeck : state.myDeck).handCards.push(card);
    }),
    takePrize: produce((state, action: PayloadAction<number>) => {
      state.gameplayActions.push({ type: 'game/takePrize', payload: action.payload });

      state.myDeck.handCards.push(state.myDeck.prizes[action.payload]);
      state.myDeck.prizes = [
        ...state.myDeck.prizes.slice(0, action.payload),
        ...state.myDeck.prizes.slice(action.payload + 1)
      ]
    })
  },
})

// Action creators are generated for each case reducer function
export const { setGamePhase, setOpponentPhase, queueAckToSend, acknowledgePhaseChangeWasReceived, loadDeck, shuffleDeck, drawOpenSeven, moveCard, drawCard, mulliganHandAway, layPrizes, takePrize } = gameSlice.actions

export default gameSlice.reducer;