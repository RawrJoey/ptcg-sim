import { BatchOfCards } from "@/components/DeckBuild/DeckBuilderModal";
import { SupabaseClient } from "@supabase/auth-helpers-react";
import { Challenge } from "./useChallenges";

export const fetchActiveDeck = async (supabaseClient: SupabaseClient, isChallenger: boolean | undefined) => {
  const { data } = await supabaseClient
    .from('Challenges')
    .select(isChallenger ? 'deck_id->deck' : 'challengee_deck_id->deck')
    .returns<{ deck: BatchOfCards }>()

  return data?.deck;
}