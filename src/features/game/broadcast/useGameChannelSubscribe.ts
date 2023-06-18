import { useAppSelector } from "@/app/hooks";
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useEffect, useRef, MutableRefObject } from "react";
import { GamePhase, GamePhaseState } from "../types/Game";
import { GameplayAction } from "../types/GameplayActions";
import { GAMEPLAY_ACTION_EVENT, GAME_ACK_EVENT } from "./types";
import { useIncomingActionHandler } from "./useIncomingActionHandler";

export const useGameChannelSubscribe = (challengeId: number | undefined) => {
  const { gameplayActionHandler } = useIncomingActionHandler();

  const supabase = useSupabaseClient();
  const channel = supabase.channel(`game-${challengeId}`);
  const myActions = useAppSelector((state) => state.game.gameplayActions);
  const acks = useAppSelector((state) => state.game.acks);
  const currentPhase = useAppSelector((state) => state.game.phase);

  const myActionsRef: MutableRefObject<GameplayAction<any>[]> = useRef([])
  const myActionsStoredLength = useRef(0);

  const acksRef: MutableRefObject<GamePhase[]> = useRef([]);
  const acksLength = useRef(0);

  const currentPhaseRef: MutableRefObject<GamePhaseState | undefined> = useRef();

  useEffect(() => {
    myActionsRef.current = myActions;
  }, [myActions]);

  useEffect(() => {
    acksRef.current = acks;
  }, [acks]);

  useEffect(() => {
    currentPhaseRef.current = currentPhase;
  }, [currentPhase]);

  useEffect(() => {
    if (!challengeId) return;

    channel.on('broadcast', { event: GAMEPLAY_ACTION_EVENT }, (event) => {
      for (const action of event.payload) {
        gameplayActionHandler({ type: action.type, payload: action.payload })
      }
    }).subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setInterval(() => {
          if (myActionsStoredLength.current < myActionsRef.current.length) {
            const lengthDiff = myActionsRef.current.length - myActionsStoredLength.current;
            myActionsStoredLength.current = myActionsRef.current.length;

            channel.send({
              type: 'broadcast',
              event: GAMEPLAY_ACTION_EVENT,
              payload: myActionsRef.current.slice(myActionsRef.current.length - lengthDiff),
            }).catch((err) => console.log(err));
          }

          if (acksLength.current < acksRef.current.length) {
            const lengthDiff = acksRef.current.length - acksLength.current;
            acksLength.current = acksRef.current.length;

            channel.send({
              type: 'broadcast',
              event: GAME_ACK_EVENT,
              payload: acksRef.current.slice(acksRef.current.length - lengthDiff),
            }).catch((err) => console.log(err));
          }
        }, 500);

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
      }
    })

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}