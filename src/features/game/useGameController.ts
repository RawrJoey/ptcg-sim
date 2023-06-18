import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { drawCard, drawOpenSeven, layPrizes, loadDeck, mulliganHandAway, setGamePhase } from './gameSlice';
import { loadDeckList } from './helpers';
import { useCodeToSetMap } from '@/hooks/useCodeToSetMap';
import { SAMPLE_LIST } from '@/helpers/deck/mocks';
import { GamePhaseState } from './types/Game';
import { Subtype, Supertype } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import { CardObject } from '@/components/Card/CardInterface';
import { AnyAction, Dispatch } from '@reduxjs/toolkit';

export   const phaseHandler = (phase: GamePhaseState, opponentPhase: GamePhaseState, handCards: CardObject[], dispatch: Dispatch<AnyAction>, codeToSetMap: any) => {
  console.log('PHASE')
  console.log(phase)
  console.log(opponentPhase)
  const phaseOkAndAcked = phase.status === 'ok' && phase.acked;
  const opponentPhaseOk = opponentPhase.status === 'ok';
  const bothPhasesOkAndAcked = phaseOkAndAcked && opponentPhaseOk;

  if (phase.type === 'not-started') {
    if (opponentPhase.type === 'not-started' && bothPhasesOkAndAcked) {
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
    if (opponentPhase.type === 'initialize' && bothPhasesOkAndAcked) {
      dispatch(setGamePhase({
        type: 'initial-draw',
        status: 'pending',
      }));
    }

    if (phase.status === 'pending') {
      dispatch(loadDeck({ payload: [] }));
      dispatch(setGamePhase({
        type: 'initialize',
        status: 'ok',
      }));
    }
  }

  if (phase.type === 'initial-draw') {
    if (opponentPhase.type === 'initial-draw' && bothPhasesOkAndAcked) {
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
      const shouldMulligan = !handCards.some((card: CardObject) => card.supertype === Supertype.Pokemon && card.subtypes.includes(Subtype.Basic));
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
    if (opponentPhase.type === 'lay-prizes' && bothPhasesOkAndAcked) {
      // TODO: Incorporate multiplayer logic, coin flip prior to this to decide first
      dispatch(setGamePhase({ type: 'your-turn', status: 'ok' }));
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
    dispatch(drawCard({ payload: undefined }));
  }

};

export const useGameController = () => {
  const { data: codeToSetMap, isLoading: codeToSetMapIsLoading } = useCodeToSetMap();

  const { phase, opponentPhase, myDeck } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!codeToSetMapIsLoading) {
      phaseHandler(phase, opponentPhase, myDeck.handCards, dispatch, codeToSetMap);
    }
  }, [phase.type, phase.status, phase.acked, opponentPhase.type, opponentPhase.status, codeToSetMapIsLoading]);
}