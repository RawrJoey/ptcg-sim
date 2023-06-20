import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setGamePhase, setIsGoingFirst } from "./gameSlice";
import { GamePhaseStatus } from "./types/Game";

export type CoinFace = 'heads' | 'tails';

interface PhaseActions {
  confirmHelperAction: () => void;
  flipCoin: (face: CoinFace) => void;
  chooseFirst: (first: boolean) => void;
}

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
      dispatch(setGamePhase({ type: 'choose-going-first', status: 'pending-input' }));
    } else {
      dispatch(setGamePhase({ type: 'choose-going-first', status: 'pending' }));
    }
  }

  const chooseFirst = (first: boolean) => {
    dispatch(setIsGoingFirst({ payload: first }));
    dispatch(setGamePhase({ ...gameState.phase, status: 'ok' }));
  }

  const phaseActions: PhaseActions = {
    confirmHelperAction,
    flipCoin,
    chooseFirst
  }

  return phaseActions;
}