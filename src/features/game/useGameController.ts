import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { checkForBasic, drawOpenSeven, GamePhase, loadDeck, mulliganHandAway, setGamePhase } from './gameSlice';
import { loadDeckList } from './helpers';
import { useCodeToSetMap } from '@/hooks/useCodeToSetMap';
import { SAMPLE_LIST } from '@/helpers/deck/mocks';
import { CardObject } from '@/components/Card/CardInterface';
import { Subtype, Supertype } from 'pokemon-tcg-sdk-typescript/dist/sdk';

export const useGameController = () => {
  const { data: codeToSetMap } = useCodeToSetMap();

  const gameState = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  const phaseHandler = useCallback(async (phase: GamePhase) => {
    if (phase.type === 'initialize') {
      const loadedDeckList = await loadDeckList(SAMPLE_LIST, codeToSetMap);
      dispatch(loadDeck(loadedDeckList));
      dispatch(setGamePhase({
        type: 'initial-draw',
        status: 'ok'
      }));
    }

    if (phase.type === 'initial-draw') {
      dispatch(drawOpenSeven());
      dispatch(checkForBasic());
    }

    if (phase.type === 'mulligan') {
      if (phase.status === 'ok') {
        dispatch(mulliganHandAway());
        dispatch(drawOpenSeven());
        dispatch(checkForBasic());
      }
    }

  }, [codeToSetMap]);

  useEffect(() => {
    if (codeToSetMap) {
      phaseHandler(gameState.phase);
    }
  }, [gameState.phase, codeToSetMap]);
}