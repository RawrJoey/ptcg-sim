import { useAppSelector } from "@/app/hooks";
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useEffect, useRef, MutableRefObject } from "react";
import { GameplayAction } from "../types/GameplayActions";
import { GAMEPLAY_ACTION_EVENT } from "./types";

export const useGameChannelUpdater = (challengeId: number | undefined) => {
  const supabase = useSupabaseClient();
  const channel = supabase.channel(`game-${challengeId}`);
  const myActions = useAppSelector((state) => state.game.gameplayActions);

  const myActionsRef: MutableRefObject<GameplayAction[]> = useRef([])
  const myActionsStoredLength = useRef(0);

  useEffect(() => {
    console.log(myActions)
    myActionsRef.current = myActions;
  }, [myActions]);

  useEffect(() => {
    if (!challengeId) return;

    channel.subscribe((status) => {
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
        }, 500);
      }
    })
  }, []);
}