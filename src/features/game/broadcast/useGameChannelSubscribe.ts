import { useAppSelector } from "@/app/hooks";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useEffect, useRef, MutableRefObject } from "react";
import { GamePhase, GamePhaseState, GameState } from "../types/Game";
import { GameplayAction } from "../types/GameplayActions";
import { GAMEPLAY_ACTION_EVENT, GAME_ACK_EVENT } from "./types";
import { useIncomingActionHandler } from "./useIncomingActionHandler";

export const useGameChannelSubscribe = (challengeId: number | undefined) => {
  const { gameplayActionHandler } = useIncomingActionHandler();
  const user = useUser();

  const supabase = useSupabaseClient();

  const broadcastChannel = supabase.channel(`game-${challengeId}`);
  const presenceChannel = supabase.channel(`game-${challengeId}-presence`, {
    config: {
      presence: {
        key: user?.id,
      },
    },
  });

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
    if (!challengeId) return;

    broadcastChannel.on('broadcast', { event: GAMEPLAY_ACTION_EVENT }, (event) => {
      for (const action of event.payload) {
        gameplayActionHandler({ type: action.type, payload: action.payload })
      }
    }).subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setInterval(() => {
          if (myActionsStoredLength.current < myActionsRef.current.length) {
            console.log('sending',  myActionsRef.current[myActionsStoredLength.current]);
            broadcastChannel.send({
              type: 'broadcast',
              event: GAMEPLAY_ACTION_EVENT,
              payload: [myActionsRef.current[myActionsStoredLength.current]],
            }).catch((err) => console.log(err));

            myActionsStoredLength.current += 1;
          }
        }, 201);

        // If current phase wasn't acked, try again
        setInterval(() => {
          if (currentPhaseRef.current?.status === 'ok' && currentPhaseRef.current?.acked === false) {
            console.log(currentPhaseRef, 'failed')
            console.log('Heartbeat failed. Trying again...');
            broadcastChannel.send({
              type: 'broadcast',
              event: GAMEPLAY_ACTION_EVENT,
              payload: [{ type: 'game/setGamePhase', payload: currentPhaseRef.current }]
            }).catch((err) => console.log(err));
          }
        }, 2000);
      }
    });
    
    presenceChannel.on('presence', { event: 'sync' }, () => {
      const state = presenceChannel.presenceState();
    }).subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setInterval(() => {
          presenceChannel.track({
            user: user?.id,
            online_oot: new Date().toISOString(),
            gameState: gameStateRef.current
          })
        }, 201);
      }
    })

    return () => {
      supabase.removeAllChannels();
    };
  }, []);
}