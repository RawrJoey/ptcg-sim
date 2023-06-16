import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { checkForBasic, drawCard, drawOpenSeven, GamePhase, layPrizes, loadDeck, mulliganHandAway, setGamePhase } from './gameSlice';
import { loadDeckList } from './helpers';
import { useCodeToSetMap } from '@/hooks/useCodeToSetMap';
import { SAMPLE_LIST } from '@/helpers/deck/mocks';

export const useGameController = () => {
  const { data: codeToSetMap, isLoading: codeToSetMapIsLoading } = useCodeToSetMap();

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

    if (phase.type === 'choose-active') {
      if (phase.status === 'ok') {
        dispatch(setGamePhase({ type: 'lay-prizes', status: 'ok'}));
      }
    }

    if (phase.type === 'lay-prizes') {
      dispatch(layPrizes());
      // TODO: Incorporate multiplayer logic, coin flip prior to this to decide first
      dispatch(setGamePhase({ type: 'your-turn', status: 'ok' }));
    }

    if (phase.type === 'your-turn') {
      dispatch(drawCard());
    }

  }, [codeToSetMap]);

  useEffect(() => {
    if (!codeToSetMapIsLoading) {
      phaseHandler(gameState.phase);
    }
  }, [gameState.phase.type, gameState.phase.status, codeToSetMapIsLoading]);
}