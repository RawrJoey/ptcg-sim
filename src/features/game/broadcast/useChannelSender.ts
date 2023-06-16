import { useAppSelector } from "@/app/hooks";
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useEffect, useRef, MutableRefObject } from "react";
import { MoveCardPayload } from "../types/Card";
import { GAMEPLAY_ACTION_EVENT } from "./types";

export const useChannelSender = () => {
  const supabase = useSupabaseClient();
  const channel = supabase.channel('test');
  const myActions = useAppSelector((state) => state.game.gameplayActions);

  const myActionsRef: MutableRefObject<MoveCardPayload[]> = useRef([])
  const myActionsStoredLength = useRef(0);

  useEffect(() => {
    myActionsRef.current = myActions;
  }, [myActions]);

  useEffect(() => {
    channel.subscribe((status) => {
      console.log(status)
      if (status === 'SUBSCRIBED') {
        setInterval(() => {

          if (myActionsStoredLength.current < myActionsRef.current.length) {
            const lengthDiff = myActionsRef.current.length - myActionsStoredLength.current;

            channel.send({
              type: 'broadcast',
              event: GAMEPLAY_ACTION_EVENT,
              payload: myActionsRef.current.slice(myActionsRef.current.length - lengthDiff),
            }).catch((err) => console.log(err));

            myActionsStoredLength.current = myActionsRef.current.length;
          }
        }, 500);
      }
    })
  }, []);
}