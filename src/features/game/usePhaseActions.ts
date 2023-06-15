import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { GamePhaseStatus, setGamePhase } from "./gameSlice";

export const usePhaseActions = () => {
  const gameState = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  const setPhaseStatus = (phaseStatus: GamePhaseStatus) => {
    dispatch(setGamePhase({
      type: gameState.phase.type,
      status: phaseStatus
    }));
  };

  return { setPhaseStatus };
}