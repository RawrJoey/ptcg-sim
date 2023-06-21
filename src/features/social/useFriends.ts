import { SupabaseClient, useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useQuery } from "@tanstack/react-query";
import { useActiveChallenges } from "./challenges/useActiveChallenges";

export interface FriendType {
  id: string;
  name: string;
  onlineStatus: boolean;
  challengeId: number | undefined;
}

const fetchFriends = async (supabaseClient: SupabaseClient, currentUser: string | undefined) => {
  if (!currentUser) return [];

  const { data, error } = await supabaseClient
    .from('Friends')
    .select('friend(id,name,username)')
    .eq('user', currentUser)
    .returns<{ friend: { id: string, name: string, username: string }}[]>();

  return data?.map(({ friend }) => friend) ?? [];
};

export const useFriends = () => {
  const supabase = useSupabaseClient();
  const user = useUser();

  const { data: friends, ...rest } = useQuery({
    queryKey: ['friend-ids', user?.id],
    queryFn: () => fetchFriends(supabase, user?.id)
  });

  const { data: activeChallenges } = useActiveChallenges(user?.id);

  return {
    // TODO: Update online status
    data: friends?.map((friend) => ({
      ...friend,
      onlineStatus: false,
      challengeId: activeChallenges?.find((challenge) => challenge.challenger === friend.id)?.id
    })),
    ...rest
  }
}