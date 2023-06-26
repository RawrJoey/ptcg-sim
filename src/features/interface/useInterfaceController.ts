import { useAppDispatch } from "@/app/hooks";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { useSavedDeck } from "../decks/useSavedDeck";
import { loadDeck, setIsChallenger } from "../game/gameSlice";
import { loadSavedDeck } from "../game/helpers";
import { useActiveGame } from "../social/challenges/useActiveGame"
import { changeScreen } from "./interfaceSlice";
import { useInterfaceActions } from "./useInterfaceActions";

export const useInterfaceController = () => {
  const { startGame } = useInterfaceActions();
  const dispatch = useAppDispatch();

  const user = useUser();
  const activeGame = useActiveGame();
  const { data: challengerDeck } = useSavedDeck(user?.id, activeGame?.deck_id)

  const onGameStart = async () => {
    try {
      const isChallenger = user?.id === activeGame?.challenger;

      startGame();
      dispatch(setIsChallenger(user?.id === activeGame?.challenger));
      
      if (isChallenger) {
        const loadedDeck = await loadSavedDeck(challengerDeck?.deck);
        dispatch(loadDeck({ payload: loadedDeck }));
      }
    } catch(err) {
      console.error('Error starting game', err)
    }
  }

  useEffect(() => {
    if (activeGame) {
      onGameStart();
    }
  }, [activeGame]);

  useEffect(() => {
    if (!user?.id) {
      dispatch((changeScreen('lobby')));
    }
  }, [user?.id]);
}