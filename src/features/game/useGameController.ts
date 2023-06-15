import { useCallback, useEffect } from 'react';
import { useAppSelector } from "@/app/hooks"
import { useDispatch } from "react-redux";
import { drawOpenSeven, GamePhase, loadDeck, setGamePhase } from './gameSlice';
import { loadDeckList } from './helpers';
import { useCodeToSetMap } from '@/hooks/useCodeToSetMap';
import { SAMPLE_LIST } from '@/helpers/deck/mocks';
import { CardObject } from '@/components/Card/CardInterface';
import { Subtype, Supertype } from 'pokemon-tcg-sdk-typescript/dist/sdk';

export const useGameController = () => {
  const { data: codeToSetMap } = useCodeToSetMap();

  const gameState = useAppSelector((state) => state.game);
  const dispatch = useDispatch();

  const phaseHandler = useCallback(async (phase: GamePhase) => {
    if (phase === 'initialize') {
      const loadedDeckList = await loadDeckList(SAMPLE_LIST, codeToSetMap);
      dispatch(loadDeck(loadedDeckList));
      dispatch(setGamePhase('initial-draw'));
    }

    if (phase === 'initial-draw') {
      dispatch(drawOpenSeven());

      const shouldMulligan = !gameState.myDeck.handCards.some((card: CardObject) => card.supertype === Supertype.Pokemon && card.subtypes.includes(Subtype.Basic));
      if (shouldMulligan) {
        dispatch(setGamePhase('mulligan'));
      } else {
        dispatch(setGamePhase('choose-active'));
      }
    }

  }, [codeToSetMap]);

  useEffect(() => {
    if (codeToSetMap) {
      phaseHandler(gameState.phase);
    }
  }, [gameState.phase, codeToSetMap]);
}