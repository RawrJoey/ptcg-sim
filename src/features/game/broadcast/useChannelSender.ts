import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useEffect, useState } from "react";

export const useChannelSender = () => {
  const supabase = useSupabaseClient();
  const channel = supabase.channel('test');

  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!isSubscribed) return;
  }, [isSubscribed]);

  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      // now you can start broadcasting
      setIsSubscribed(true);
      setInterval(() => {
        channel.send({
          type: 'broadcast',
          event: 'cursor-pos',
          payload: { x: Math.random(), y: Math.random() },
        })
        console.log(status)
      }, 100)
    }
  })
}