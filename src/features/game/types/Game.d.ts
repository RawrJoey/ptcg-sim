import { MoveCardPayload } from "./Card";
import { DeckState } from "./Deck";
import { GameplayAction } from "./GameplayActions";

export type GamePhaseType = 'not-started' | 'initialize' | 'initial-draw' | 'mulligan' | 'choose-active' | 'lay-prizes' | 'your-turn' | 'opponent-turn' | 'game-end';
export type GamePhaseStatus = 'ok' | 'pending-user-input' | 'pending-confirm';

export interface GamePhase {
  type: GamePhaseType,
  status: GamePhaseStatus
}

export type TurnPhase = 'draw' | 'main' | 'attack' | 'apply-damage' | 'take-prize' | 'end';

export interface GameState {
  phase: GamePhase,
  currentTurnPhase: TurnPhase | null,
  myDeck: DeckState,
  opponentDeck: DeckState,
  gameplayActions: GameplayAction[]
};