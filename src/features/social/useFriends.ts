import { SupabaseClient, useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useQuery } from "@tanstack/react-query";

export interface FriendType {
  name: string;
  onlineStatus: boolean;
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
    .select('name')
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

  return {
    // TODO: Update online status
    data: friendList?.map((friend) => ({
      ...friend,
      onlineStatus: false
    })),
    isLoading: friendIdsIsLoading || friendListIsLoading
  }
}