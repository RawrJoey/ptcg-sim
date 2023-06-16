import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { GAMEPLAY_ACTION_EVENT, GAME_PHASE_EVENT } from "./types";
import { useIncomingActionHandler } from "./useIncomingActionHandler";

export const useGameChannelListener = (challengeId: number | undefined) => {
  const supabase = useSupabaseClient();
  const { incomingActionHandler } = useIncomingActionHandler();

  useEffect(() => {
    supabase
      .channel(`game-${challengeId}`)
      .on('broadcast', { event: GAMEPLAY_ACTION_EVENT }, (event) => incomingActionHandler({ type: event.event, payload: event.payload }));

    supabase
      .channel(`game-${challengeId}`)
      .on('broadcast', { event: GAME_PHASE_EVENT }, (payload) => console.log(payload))
  }, [])
};