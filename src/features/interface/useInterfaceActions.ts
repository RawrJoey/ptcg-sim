import { useAppDispatch } from "@/app/hooks"
import { setGamePhase } from "../game/gameSlice";
import { changeScreen } from "./interfaceSlice";

export const useInterfaceActions = () => {
  const dispatch = useAppDispatch();

  const startGame = () => {
    dispatch(changeScreen('in-game'));
    dispatch(setGamePhase({ type: 'initialize', status: 'ok'}));
  };

  return { startGame };
}