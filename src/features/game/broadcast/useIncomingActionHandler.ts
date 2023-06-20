import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { acknowledgePhaseChangeWasReceived, drawOpenSeven, layPrizes, loadDeck, moveCard, queueAckToSend, setGamePhase, setIsGoingFirst, setOpponentPhase, setWhoIsFlipping } from "../gameSlice";
import { GameplayAction } from "../types/GameplayActions"

export const useIncomingActionHandler = () => {
  const dispatch = useAppDispatch();

  const gameplayActionHandler = (action: GameplayAction<any>) => {
    console.log('gameplay', action)
    if (action.type === 'game/setGamePhase') {
      if (action.payload.status === 'ok') {
        dispatch(queueAckToSend(action.payload));
      }
      dispatch(setOpponentPhase(action.payload));
    } else if (action.type === 'game/loadDeck') {
      dispatch(loadDeck({ payload: action.payload, isOpponent: true }));
    } else if (action.type === 'game/drawOpenSeven') {
      dispatch(drawOpenSeven({ payload: action.payload, isOpponent: true }));
    } else if (action.type === 'game/moveCard') {
      dispatch(moveCard({ payload: action.payload, isOpponent: true }));
    } else if (action.type === 'game/layPrizes') {
      dispatch(layPrizes({ payload: action.payload, isOpponent: true }));
    } else if (action.type === 'game/queueAckToSend') {
      dispatch(acknowledgePhaseChangeWasReceived(action.payload));
    } else if (action.type === 'game/setWhoIsFlipping') {
      dispatch(setWhoIsFlipping({ payload: action.payload, isOpponent: true }))
    } else if (action.type === 'game/setIsGoingFirst') {
      dispatch(setIsGoingFirst({ payload: action.payload.youAreFlipping, isOpponent: true }));
    }
  };

  return { gameplayActionHandler };
}