import { useAppDispatch } from "@/app/hooks";
import { useCallback } from "react";
import { drawOpenSeven, loadDeck, moveCard } from "../gameSlice";
import { GameplayAction } from "../types/GameplayActions"

export const useIncomingActionHandler = () => {
  const dispatch = useAppDispatch();

  const incomingActionHandler = useCallback((action: GameplayAction<any>) => {
    if (action.type === 'game/loadDeck') {
      dispatch(loadDeck({ payload: action.payload.payload, isOpponent: true }));
    } else if (action.type === 'game/drawOpenSeven') {
      dispatch(drawOpenSeven({ payload: undefined, isOpponent: true }));
    } else if (action.type === 'game/moveCard') {
      dispatch(moveCard({ payload: action.payload.payload, isOpponent: true }));
    }
  }, [dispatch, loadDeck])

  return { incomingActionHandler };
}