import { useAppSelector } from "@/app/hooks";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useEffect, useRef, MutableRefObject } from "react";
import { GamePhase, GamePhaseState } from "../types/Game";
import { GameplayAction } from "../types/GameplayActions";
import { GAMEPLAY_ACTION_EVENT, GAME_ACK_EVENT } from "./types";
import { useIncomingActionHandler } from "./useIncomingActionHandler";

export const useGameChannelSubscribe = (challengeId: number | undefined) => {
  const { gameplayActionHandler } = useIncomingActionHandler();
  const user = useUser();

  const supabase = useSupabaseClient();

  const channel = supabase.channel(`game-${challengeId}`);

  const myActions = useAppSelector((state) => state.game.gameplayActions);
  const currentPhase = useAppSelector((state) => state.game.phase);

  const myActionsRef: MutableRefObject<GameplayAction<any>[]> = useRef([])
  const myActionsStoredLength = useRef(0);


  const currentPhaseRef: MutableRefObject<GamePhaseState | undefined> = useRef();

  useEffect(() => {
    myActionsRef.current = myActions;
  }, [myActions]);

  useEffect(() => {
    currentPhaseRef.current = currentPhase;
  }, [currentPhase]);

  useEffect(() => {
    if (!challengeId) return;

    channel.on('broadcast', { event: GAMEPLAY_ACTION_EVENT }, (event) => {
      for (const action of event.payload) {
        gameplayActionHandler({ type: action.type, payload: action.payload })
      }
    }).subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        setInterval(() => {
          if (myActionsStoredLength.current < myActionsRef.current.length) {
            console.log('sending',  myActionsRef.current[myActionsStoredLength.current]);

            channel.track({
              ...channel.presenceState(),
              actions: channel.presenceState().actions ? [...channel.presenceState().actions, myActionsRef.current[myActionsStoredLength.current]] : myActionsRef.current[myActionsStoredLength.current]
            });

            channel.send({
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
            channel.send({
              type: 'broadcast',
              event: GAMEPLAY_ACTION_EVENT,
              payload: [{ type: 'game/setGamePhase', payload: currentPhaseRef.current }]
            }).catch((err) => console.log(err));
          }
        }, 2000);

        const presenceTrackStatus = await channel.track({
          user: user?.id,
          online_at: new Date().toISOString(),
        })
        console.log(presenceTrackStatus)
      }
    }).on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      console.log(state)
    })
    .subscribe()

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}