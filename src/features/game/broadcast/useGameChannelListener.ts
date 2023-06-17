import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { GAMEPLAY_ACTION_EVENT, GAME_ACK_EVENT } from "./types";
import { useIncomingActionHandler } from "./useIncomingActionHandler";

export const useGameChannelListener = (challengeId: number | undefined) => {
  const supabase = useSupabaseClient();
  const { gameplayActionHandler, ackActionHandler } = useIncomingActionHandler();

  useEffect(() => {
    supabase
      .channel(`game-${challengeId}`)
      .on('broadcast', { event: GAMEPLAY_ACTION_EVENT }, (event) => {
        for (const action of event.payload) {
          gameplayActionHandler({ type: action.type, payload: action.payload })
        }
      })
      
    supabase
      .channel(`game-${challengeId}`)
      .on('broadcast', { event: GAME_ACK_EVENT }, (event) => {
        for (const action of event.payload) {
          // TODO: change this from hard coded maybe idk
          ackActionHandler({ type: 'game/setGamePhase', payload: action })
        }
      });
  }, [])
};