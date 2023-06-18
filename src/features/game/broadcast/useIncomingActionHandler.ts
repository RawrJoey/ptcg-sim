import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useCodeToSetMap } from "@/hooks/useCodeToSetMap";
import { useCallback } from "react";
import { acknowledgePhaseChangeWasReceived, drawOpenSeven, layPrizes, loadDeck, moveCard, queueAckToSend, setOpponentPhase } from "../gameSlice";
import { GameplayAction } from "../types/GameplayActions"
import { phaseHandler } from "../useGameController";

export const useIncomingActionHandler = () => {
  const gameState = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const { data: codeToSetMap } = useCodeToSetMap(); 

  const gameplayActionHandler = useCallback((action: GameplayAction<any>) => {
    console.log('gameplay', action)
    if (action.type === 'game/setGamePhase') {
      if (action.payload.status === 'ok') {
        dispatch(queueAckToSend(action.payload));
      }
      dispatch(setOpponentPhase(action.payload));
      phaseHandler(gameState.phase, gameState.opponentPhase, gameState.myDeck.handCards, dispatch, codeToSetMap);
    } else if (action.type === 'game/loadDeck') {
      dispatch(loadDeck({ payload: action.payload, isOpponent: true }));
    } else if (action.type === 'game/drawOpenSeven') {
      dispatch(drawOpenSeven({ payload: undefined, isOpponent: true }));
    } else if (action.type === 'game/moveCard') {
      dispatch(moveCard({ payload: action.payload, isOpponent: true }));
    } else if (action.type === 'game/layPrizes') {
      dispatch(layPrizes({ payload: action.payload, isOpponent: true }));
    } else if (action.type === 'game/queueAckToSend') {
      dispatch(acknowledgePhaseChangeWasReceived());
    }
  }, [dispatch]);

  return { gameplayActionHandler };
}