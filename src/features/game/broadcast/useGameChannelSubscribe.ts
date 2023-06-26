import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useEffect, useRef, MutableRefObject } from "react";
import { setOpponentGameState } from "../gameSlice";
import { GamePhase, GamePhaseState, GameState } from "../types/Game";
import { GameplayAction } from "../types/GameplayActions";
import { GAMEPLAY_ACTION_EVENT, GAME_ACK_EVENT } from "./types";
import { useIncomingActionHandler } from "./useIncomingActionHandler";
import type { RealtimePresenceState, RealtimeChannel } from '@supabase/supabase-js';

export const useGameChannelSubscribe = (challengeId: number | undefined) => {
  const dispatch = useAppDispatch();
  const { gameplayActionHandler } = useIncomingActionHandler();
  const user = useUser();

  const supabase = useSupabaseClient();

  const broadcastChannel = supabase.channel(`game-${challengeId}`);
  console.log(user?.id)
  let presenceChannel: RealtimeChannel | undefined;

  const myActions = useAppSelector((state) => state.game.gameplayActions);
  const currentPhase = useAppSelector((state) => state.game.phase);
  const gameState = useAppSelector((state) => state.game);

  const myActionsRef: MutableRefObject<GameplayAction<any>[]> = useRef([])
  const myActionsStoredLength = useRef(0);

  const currentPhaseRef: MutableRefObject<GamePhaseState | undefined> = useRef();
  const gameStateRef: MutableRefObject<GameState | undefined> = useRef()

  useEffect(() => {
    myActionsRef.current = myActions;
  }, [myActions]);

  useEffect(() => {
    currentPhaseRef.current = currentPhase;
  }, [currentPhase]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    if (user?.id) {
      presenceChannel = supabase.channel(`game-${challengeId}-presence`, {
        config: {
          presence: {
            key: user?.id,
          },
        },
      });
    }
  }, [user?.id]);

  useEffect(() => {
    if (!challengeId) return;
    if (presenceChannel === undefined) return;

    presenceChannel!.on('presence', { event: 'sync' }, () => {
      const state: RealtimePresenceState<{ gameState: GameState }> = presenceChannel!.presenceState();
      const opponentId = Object.keys(state).find((key) => key !== user?.id);

      if (!opponentId) {
        return console.log('Opponent is not in the game.');
      }

      const opponentGameState: GameState = state[opponentId as string][0].gameState;
      if (opponentGameState) {
        dispatch(setOpponentGameState(opponentGameState))
      } else {
        console.log('Whoops, not defined', opponentGameState)
      }
    }).subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setInterval(() => {
          const state: RealtimePresenceState<{ gameState: GameState }> = presenceChannel!.presenceState();

          if (user?.id) {
            const myPresence = state[user.id];

            if (myPresence) {
              const savedGameState = myPresence.at(0)?.gameState;
  
              if (savedGameState) {
                const actionWasPerformed = gameStateRef.current?.gameplayActions.length !== savedGameState.gameplayActions.length
                // probably redundant
                const phaseChanged = gameStateRef.current?.phase.type !== savedGameState.phase.type || gameStateRef.current.phase.status !== savedGameState.phase.status;
                const somethingChanged = actionWasPerformed || phaseChanged;

                if (somethingChanged) {
                  presenceChannel!.track({
                    gameState: gameStateRef.current
                  })
                }
              }
            } else {
              presenceChannel!.track({
                gameState: gameStateRef.current
              })
            }
          }
        }, 201);
      }
    })

    return () => {
      presenceChannel && supabase.removeChannel(presenceChannel);
    };
  }, [presenceChannel === undefined]);
}