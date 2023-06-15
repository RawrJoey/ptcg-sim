import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setGamePhase } from "./gameSlice";

export const usePhaseActions = () => {
  const gameState = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  const confirmHelperInstructions = () => {
    dispatch(setGamePhase({
      type: gameState.phase.type,
      status: 'ok'
    }));
  };

  return { confirmHelperInstructions };
}