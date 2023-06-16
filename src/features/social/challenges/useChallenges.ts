import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { SupabaseClient } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query";

interface Challenge {
  challengee: string;
  challenger: string;
}

const fetchChallenges = async (supabaseClient: SupabaseClient) => {
  const { data } = await supabaseClient
    .from('Challenges')
    .select('challengee,challenger')
    .eq('active', true)
    .returns<Challenge[]>();

  return data ?? [];
}

export const useChallenges = (userId: string | undefined) => {
  const supabaseClient = useSupabaseClient();

  const { data, ...rest } = useQuery({
    queryKey: ['active-challenges'],
    queryFn: () => fetchChallenges(supabaseClient)
  });

  return {
    data: data?.filter((challenge) => challenge.challengee === userId)
  }
}