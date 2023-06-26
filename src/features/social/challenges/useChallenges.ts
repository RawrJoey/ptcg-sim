import { BatchOfCards } from "@/components/DeckBuild/DeckBuilderModal";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { SupabaseClient } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query";

export interface Challenge {
  id: number;
  challengee: string;
  challenger: string;
  active: boolean;
  gameIsRunning: boolean;
  deck_id: { deck: BatchOfCards };
  challengee_deck_id: { deck: BatchOfCards };
}

const fetchChallenges = async (supabaseClient: SupabaseClient) => {
  const { data } = await supabaseClient
    .from('Challenges')
    .select('id,challengee,challenger,active,gameIsRunning,deck_id(deck),challengee_deck_id(deck)')
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