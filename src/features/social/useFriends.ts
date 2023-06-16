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
    .select('friend')
    .eq('user', currentUser);

  return data?.map(({ friend }) => friend) ?? [];
};

const fetchProfiles = async (supabaseClient: SupabaseClient, userIdList: string[] | undefined) => {
  if (!userIdList) return [];

  const { data, error } = await supabaseClient
    .from('Profiles')
    .select('id,name')
    .filter('id', 'in', `(${userIdList.reduce((acc, curr) => acc === '' ? `"${curr}"` : `"${acc}","${curr}"`, '')})`)
  
  return data ?? [];
};

export const useFriends = () => {
  const supabase = useSupabaseClient();
  const user = useUser();

  const { data: friendIds, isLoading: friendIdsIsLoading } = useQuery({
    queryKey: ['friend-ids', user?.id],
    queryFn: () => fetchFriends(supabase, user?.id)
  });

  const { data: friendList, isLoading: friendListIsLoading } = useQuery({
    queryKey: ['friend-list', friendIds],
    queryFn: () => fetchProfiles(supabase, friendIds)
  });

  const { data: activeChallenges } = useActiveChallenges(user?.id);

  return {
    // TODO: Update online status
    data: friendList?.map((friend) => ({
      ...friend,
      onlineStatus: false,
      challengeId: activeChallenges?.find((challenge) => challenge.challenger === friend.id)?.id
    })),
    isLoading: friendIdsIsLoading || friendListIsLoading
  }
}