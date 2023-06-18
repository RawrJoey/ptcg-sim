import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setGamePhase, setIsGoingFirst } from "./gameSlice";
import { GamePhaseStatus } from "./types/Game";

export type CoinFace = 'heads' | 'tails';

export const usePhaseActions = () => {
  const gameState = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  const confirmHelperAction = () => {
    dispatch(setGamePhase({ ...gameState.phase, status: 'ok' }));
  }

  const flipCoin = (face: CoinFace) => {
    const randomNum = Math.floor(Math.random() * 2);

    // Won the flip
    if ((randomNum === 0 && face === 'heads') || randomNum === 1 && face === 'tails') {
      dispatch(setIsGoingFirst({ payload: true }));
    } else {
      dispatch(setIsGoingFirst({ payload: false }));
    }
  }

  return { confirmHelperAction, flipCoin };
}