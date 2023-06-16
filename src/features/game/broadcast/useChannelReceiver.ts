import { createClient } from "@supabase/supabase-js";
import { GAMEPLAY_ACTION_EVENT } from "./types";

export const useChannelReceiver = () => {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '');

  supabase
    .channel('test')
    .on('broadcast', { event: GAMEPLAY_ACTION_EVENT }, (payload) => console.log(payload))
};