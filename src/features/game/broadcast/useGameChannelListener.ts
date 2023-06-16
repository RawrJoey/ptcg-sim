import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { GAMEPLAY_ACTION_EVENT, GAME_PHASE_EVENT } from "./types";

export const useGameChannelListener = (challengeId: number | undefined) => {
  const supabase = useSupabaseClient();

  useEffect(() => {
    supabase
      .channel(`game-${challengeId}`)
      .on('broadcast', { event: GAMEPLAY_ACTION_EVENT }, (payload) => console.log(payload));

    supabase
      .channel(`game-${challengeId}`)
      .on('broadcast', { event: GAME_PHASE_EVENT }, (payload) => console.log(payload))
  }, [])
};