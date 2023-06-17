import { useAppDispatch } from "@/app/hooks"
import { changeScreen } from "./interfaceSlice";

export const useInterfaceActions = () => {
  const dispatch = useAppDispatch();

  const startGame = () => {
    dispatch(changeScreen('in-game'));
  };

  return { startGame };
}