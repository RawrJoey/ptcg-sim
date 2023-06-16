import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { SupabaseClient } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query";

export interface Challenge {
  id: number;
  challengee: string;
  challenger: string;
  active: boolean;
  gameIsRunning: boolean;
}

const fetchChallenges = async (supabaseClient: SupabaseClient) => {
  const { data } = await supabaseClient
    .from('Challenges')
    .select('id,challengee,challenger,active,gameIsRunning')
    .returns<Challenge[]>();

  return data ?? [];
}

export const useChallenges = (userId: string | undefined) => {
  const supabaseClient = useSupabaseClient();

  const { data, ...rest } = useQuery({
    queryKey: ['challenges'],
    queryFn: () => fetchChallenges(supabaseClient)
  });

  return {
    data: data?.filter((challenge) => challenge.challenger === userId || challenge.challengee === userId),
    ...rest
  }
}