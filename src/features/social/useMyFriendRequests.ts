import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { SupabaseClient } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query";
import { useCurrentProfile } from "./useCurrentProfile";

const fetchMyFriendRequests = async (supabaseClient: SupabaseClient, username: string) => {
  const res = await supabaseClient.from('Friend Requests').select('from ( id,name,username )').eq('to', username).eq('accepted', false).returns<{from: { id: string, name: string, username: string }}[]>();

  return res.data?.map(({ from }) => from);
}

export const useMyFriendRequests = () => {
  const { data: profile } = useCurrentProfile();
  const supabase = useSupabaseClient();

  return useQuery({
    queryKey: ['my-friend-requests'],
    queryFn: () => fetchMyFriendRequests(supabase, profile?.username)
  })
}