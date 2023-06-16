import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GAMEPLAY_ACTION_EVENT } from "./types";

export const useChannelReceiver = () => {
  const supabase = useSupabaseClient();

  supabase
    .channel('test')
    .on('broadcast', { event: GAMEPLAY_ACTION_EVENT }, (payload) => console.log(payload))
};