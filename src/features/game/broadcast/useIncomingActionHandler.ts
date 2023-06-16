import { useDispatch } from "react-redux"
import { loadDeck } from "../gameSlice";
import { GameplayAction } from "../types/GameplayActions"

export const useIncomingActionHandler = () => {
  const dispatch = useDispatch();

  const incomingActionHandler = (action: GameplayAction<any>) => {
    if (action.type === 'game/loadDeck') {
      dispatch(loadDeck({ payload: action.payload, isOpponent: true }));
    }
  }

  return { incomingActionHandler };
}