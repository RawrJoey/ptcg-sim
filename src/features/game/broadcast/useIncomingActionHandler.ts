import { useAppDispatch } from "@/app/hooks";
import { useCallback } from "react";
import { acknowledgePhaseChangeWasReceived, drawOpenSeven, layPrizes, loadDeck, moveCard, queueAckToSend, setOpponentPhase } from "../gameSlice";
import { GameplayAction } from "../types/GameplayActions"

export const useIncomingActionHandler = () => {
  const dispatch = useAppDispatch();

  const gameplayActionHandler = useCallback((action: GameplayAction<any>) => {
    console.log(action)
    if (action.type === 'game/setGamePhase') {
      if (action.payload.status === 'ok') {
        dispatch(queueAckToSend(action.payload));
      }
      dispatch(setOpponentPhase(action.payload));
    } else if (action.type === 'game/loadDeck') {
      dispatch(loadDeck({ payload: action.payload, isOpponent: true }));
    } else if (action.type === 'game/drawOpenSeven') {
      dispatch(drawOpenSeven({ payload: undefined, isOpponent: true }));
    } else if (action.type === 'game/moveCard') {
      dispatch(moveCard({ payload: action.payload, isOpponent: true }));
    } else if (action.type === 'game/layPrizes') {
      dispatch(layPrizes({ payload: action.payload, isOpponent: true }));
    }
  }, [dispatch]);

  const ackActionHandler = useCallback((action: GameplayAction<any>) => {
    // TODO (maybe?): ack all gameplay actions?
    if (action.type === 'game/setGamePhase') {
      dispatch(acknowledgePhaseChangeWasReceived());
    }
  }, [dispatch]);

  return { gameplayActionHandler, ackActionHandler };
}