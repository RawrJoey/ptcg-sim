import { CardObject } from '@/components/Card/CardInterface';
import { CardZone } from '@/components/Card/DraggableCard';
import { PayloadAction } from '@reduxjs/toolkit';
import { setGamePhase, loadDeck, shuffleDeck, drawOpenSeven, moveCard, drawCard, mulliganHandAway, checkForBasic, layPrizes, takePrize } from '../gameSlice';
import { GamePhase } from './Game';

export type GameplayActionType = typeof setGamePhase.type | typeof loadDeck.type | typeof shuffleDeck.type | typeof drawOpenSeven.type | typeof moveCard.type | typeof drawCard.type | typeof mulliganHandAway.type | typeof checkForBasic.type | typeof layPrizes.type | typeof takePrize.type;

export interface MoveCardPayload {
  // The card being moved
  card: CardObject,
  // The zone of origin
  origin: CardZone,
  // The destination zone
  destination: CardZone,
}

export interface GameplayAction {
  type: GameplayActionType;
  payload?: GamePhase | CardObject[] | MoveCardPayload | number;
}