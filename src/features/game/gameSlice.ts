import { createSlice } from "@reduxjs/toolkit";

export type GamePhase = 'initial-draw' | 'mulligan' | 'choose-active' | 'your-turn' | 'opponent-turn' | 'game-end';

export type TurnPhase = 'draw' | 'main' | 'attack' | 'apply-damage' | 'take-prize' | 'end';

interface GameState {
  phase: GamePhase,
  currentTurnPhase: TurnPhase | null
};

const initialState: GameState = {
  phase: 'initial-draw',
  currentTurnPhase: null
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    
  }
})