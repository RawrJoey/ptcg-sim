import { useAppDispatch } from "@/app/hooks";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { setIsChallenger } from "../game/gameSlice";
import { useActiveGame } from "../social/challenges/useActiveGame"
import { changeScreen } from "./interfaceSlice";
import { useInterfaceActions } from "./useInterfaceActions";

export const useInterfaceController = () => {
  const { startGame } = useInterfaceActions();
  const dispatch = useAppDispatch();

  const user = useUser();
  const activeGame = useActiveGame();

  useEffect(() => {
    if (activeGame) {
      startGame();
      dispatch(setIsChallenger(user?.id === activeGame.challenger));
    }
  }, [activeGame]);

  useEffect(() => {
    if (!user?.id) {
      dispatch((changeScreen('lobby')));
    }
  }, [user?.id]);
}