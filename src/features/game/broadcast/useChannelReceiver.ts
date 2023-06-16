import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { GAMEPLAY_ACTION_EVENT } from "./types";

export const useChannelReceiver = () => {
  const supabase = useSupabaseClient();

  useEffect(() => {
    supabase
    .channel('test')
    .on('broadcast', { event: GAMEPLAY_ACTION_EVENT }, (payload) => console.log(payload))
  }, [])
};