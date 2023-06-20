import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { drawCard, drawOpenSeven, layPrizes, loadDeck, mulliganHandAway, setGamePhase } from './gameSlice';
import { loadDeckList } from './helpers';
import { useCodeToSetMap } from '@/hooks/useCodeToSetMap';
import { SAMPLE_LIST } from '@/helpers/deck/mocks';
import { GamePhaseState } from './types/Game';
import { Subtype, Supertype } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import { CardObject } from '@/components/Card/CardInterface';

export const useGameController = () => {
  const { data: codeToSetMap, isLoading: codeToSetMapIsLoading } = useCodeToSetMap();

  const { phase, opponentPhase, myDeck, isChallenger, isGoingFirst } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  const phaseHandler = () => {
    console.log('PHASE')
    console.log(phase)
    console.log(opponentPhase)
    const phaseOk = phase.status === 'ok';
    const opponentPhaseOk = opponentPhase.status === 'ok';
    const bothPhasesOk = phaseOk && opponentPhaseOk;

    if (phase.type === 'not-started') {
      if ((opponentPhase.type === 'not-started' && bothPhasesOk) || (opponentPhase.type === 'initialize' && phaseOk)) {
        dispatch(setGamePhase({
          type: 'initialize',
          status: 'pending'
        }));
      }

      if (phase.status === 'pending') {
        dispatch(setGamePhase({
          type: 'not-started',
          status: 'ok'
        }));
      }
    }

    if (phase.type === 'initialize') {
      if ((opponentPhase.type === 'initialize' && bothPhasesOk) || (opponentPhase.type === 'flip-coin' && phaseOk)) {
        if (isChallenger) {
          const randomNum = Math.floor(Math.random() * 2);
          const iAmFlipping = randomNum === 1;

          if (iAmFlipping) {
            dispatch(setGamePhase({ type: 'flip-coin', status: 'pending-action-selection'}));
          } else {
            dispatch(setGamePhase({ type: 'flip-coin', status: 'pending' }));
          }
        } else {
          dispatch(setGamePhase({
            type: 'flip-coin',
            status: 'pending',
          }));
        }
      }

      if (phase.status === 'pending') {
        loadDeckList(SAMPLE_LIST, codeToSetMap).then((loadedDeckList) => {
          dispatch(loadDeck({ payload: loadedDeckList }));
          dispatch(setGamePhase({
            type: 'initialize',
            status: 'ok',
          }));
        });
      }
    }

    if (phase.type === 'flip-coin') {
      // If opponent decided who flips and it's you, start flipping
      if (opponentPhase.type === 'flip-coin' && opponentPhase.status === 'pending' && phase.status === 'pending') {
        dispatch(setGamePhase({ type: 'flip-coin', status: 'pending-action-selection'}));
      }

      if (opponentPhase.type === 'choose-going-first') {
        if (opponentPhase.status === 'pending') {
          dispatch(setGamePhase({
            type: 'choose-going-first',
            status: 'pending-action-selection'
          }));
        }

        if (opponentPhase.status === 'pending-action-selection') {
          dispatch(setGamePhase({
            type: 'choose-going-first',
            status: 'pending'
          }));
        }
      }
    }

    if (phase.type === 'choose-going-first') {
      // Check for OR here because only one player is going to choose going first
      if ((phaseOk || opponentPhaseOk) || (opponentPhase.type === 'initial-draw' && phaseOk)) {
        dispatch(setGamePhase({
          type: 'initial-draw',
          status: 'ok'
        }));
      }
    }

    // TODO: show go first message
    if (phase.type === 'go-first-message') {

    }

    if (phase.type === 'initial-draw') {
      if (phase.status === 'ok') {
        dispatch(setGamePhase({
          type: 'check-for-basic',
          status: 'pending',
        }));
      }

      if (phase.status === 'pending') {
        dispatch(drawOpenSeven({ payload: undefined }));
        dispatch(setGamePhase({
          type: 'initial-draw',
          status: 'ok'
        }));
      }
    }

    if (phase.type === 'check-for-basic') {
      if (phase.status === 'pending') {
        const shouldMulligan = !myDeck.handCards.some((card: CardObject) => card.supertype === Supertype.Pokemon && card.subtypes.includes(Subtype.Basic));
        if (shouldMulligan) {
          dispatch(setGamePhase({
            type: 'mulligan',
            status: 'pending'
          }));
        } else {
          dispatch(setGamePhase({
            type: 'choose-active',
            status: 'pending-input'
          }));
        }
      }
    }

    if (phase.type === 'mulligan') {
      if (phase.status === 'pending') {
        dispatch(mulliganHandAway());
        dispatch(drawOpenSeven({ payload: undefined }));
        dispatch(setGamePhase({
          type: 'check-for-basic',
          status: 'pending'
        }));
      }
    }

    if (phase.type === 'choose-active') {
      if (phase.status === 'ok') {
        dispatch(setGamePhase({ type: 'lay-prizes', status: 'pending'}));
      }
    }

    if (phase.type === 'lay-prizes') {
      if ((opponentPhase.type === 'lay-prizes' && bothPhasesOk) || ((opponentPhase.type === 'your-turn' || opponentPhase.type === 'opponent-turn') && phaseOk)) {
        if (isGoingFirst) {
          dispatch(setGamePhase({ type: 'your-turn', status: 'pending' }));
        } else {
          dispatch(setGamePhase({ type: 'opponent-turn', status: 'pending'}));
        }
      }

      if (phase.status === 'pending') {
        dispatch(layPrizes({ payload: undefined }));
        dispatch(setGamePhase({
          type: 'lay-prizes',
          status: 'ok'
        }));
      }
    }

    if (phase.type === 'your-turn') {
      if (phase.status === 'pending') {
        dispatch(drawCard({ payload: undefined }));
        dispatch(setGamePhase({
          type: 'your-turn',
          status: 'ok'
        }));
      }
    }
  };

  useEffect(() => {
    if (!codeToSetMapIsLoading) {
      phaseHandler();
    }
  }, [phase.type, phase.status, phase.acked, opponentPhase.type, opponentPhase.status, codeToSetMapIsLoading]);
}