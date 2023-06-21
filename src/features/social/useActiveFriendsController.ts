import { useRef, useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { FriendType, useFriends } from "./useFriends"
import type { RealtimePresenceState } from '@supabase/supabase-js';

export const useActiveFriendsController = () => {
  const friends = useFriends();
  const supabase = useSupabaseClient();
  const user = useUser();
  const friendsRef = useRef<FriendType[] | undefined>();

  const [activeFriends, setActiveFriends] = useState<Record<string, boolean> | undefined>({});

  useEffect(() => {
    friendsRef.current = friends.data;
  }, [friends.data]);

  const presenceChannel = supabase.channel(`online`, {
    config: {
      presence: {
        key: user?.id,
      },
    },
  });

  presenceChannel.on('presence', { event: 'sync' }, () => {
    const state: RealtimePresenceState<{ id: string, online_at: string }> = presenceChannel.presenceState();
    const friendActiveStatus: Record<string, boolean> | undefined = friendsRef.current?.reduce((acc, curr) => {
      if (Object.values(state).some(activePlayer => activePlayer[0].id === curr.id)) {
        return {
          ...acc,
          [curr.id]: true
        }
      }

      return {
        ...acc,
        [curr.id]: false
      }
    }, {});
    console.log(state)

    setActiveFriends(friendActiveStatus)
  }).subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      presenceChannel.track({
        id: user?.id,
        online_at: new Date().toISOString(),
      })
    }
  });

  return activeFriends;
}