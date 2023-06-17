import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setGamePhase } from "./gameSlice";
import { GamePhaseStatus } from "./types/Game";

export const usePhaseActions = () => {
  const gameState = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  const confirmHelperAction = () => {
    dispatch(setGamePhase({ ...gameState.phase, status: 'ok' }));
  }

  return { confirmHelperAction };
}