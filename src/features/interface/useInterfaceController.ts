import { useAppDispatch } from "@/app/hooks";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { setGamePhase } from "../game/gameSlice";
import { useActiveGame } from "../social/challenges/useActiveGame"
import { changeScreen } from "./interfaceSlice";

export const useInterfaceController = () => {
  const dispatch = useAppDispatch();

  const user = useUser();
  const activeGame = useActiveGame();

  useEffect(() => {
    if (activeGame) {
      dispatch(changeScreen('in-game'));
      dispatch(setGamePhase({ type: 'initialize', status: 'ok' }));  
    }
  }, [activeGame]);
}