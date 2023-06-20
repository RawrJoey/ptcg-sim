import { MoveCardPayload } from "./Card";
import { DeckState } from "./Deck";
import { GameplayAction } from "./GameplayActions";

export type GamePhaseType = 'not-started' | 'initialize' | 'flip-coin' | 'choose-going-first' | 'go-first-message' | 'initial-draw' | 'check-for-basic' | 'mulligan' | 'choose-active' | 'lay-prizes' | 'your-turn' | 'opponent-turn' | 'game-end';
export type GamePhaseStatus = 'ok' | 'pending' | 'pending-input';

export interface GamePhase {
  type: GamePhaseType,
  status: GamePhaseStatus,
}

export interface GamePhaseState extends GamePhase {
  acked: boolean
}

export type TurnPhase = 'draw' | 'main' | 'attack' | 'apply-damage' | 'take-prize' | 'end';

export interface GameState {
  phase: GamePhaseState,
  opponentPhase: GamePhaseState,
  currentTurnPhase: TurnPhase | null,
  myDeck: DeckState,
  opponentDeck: DeckState,
  gameplayActions: GameplayAction[],
  acks: GamePhase[],
  isGoingFirst: boolean | undefined,
  isChallenger: boolean | undefined
};