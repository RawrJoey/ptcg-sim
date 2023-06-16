import { useAppDispatch } from "@/app/hooks";
import { useCallback } from "react";
import { loadDeck } from "../gameSlice";
import { GameplayAction } from "../types/GameplayActions"

export const useIncomingActionHandler = () => {
  const dispatch = useAppDispatch();

  const incomingActionHandler = useCallback((action: GameplayAction<any>) => {
    if (action.type === 'game/loadDeck') {
      dispatch(loadDeck({ payload: action.payload.payload, isOpponent: true }));
    }
  }, [dispatch, loadDeck])

  return { incomingActionHandler };
}