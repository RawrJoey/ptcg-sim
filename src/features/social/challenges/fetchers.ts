import { BatchOfCards } from "@/components/DeckBuild/DeckBuilderModal";
import { SupabaseClient } from "@supabase/auth-helpers-react";
import { Challenge } from "./useChallenges";

export const fetchActiveDeck = async (supabaseClient: SupabaseClient, isChallenger: boolean | undefined) => {
  const { data } = await supabaseClient
    .from('Challenges')
    .select('deck_id(deck),challengee_deck_id(deck)')
    .eq('gameIsRunning', true)
    .returns<{ deck_id: { deck: BatchOfCards }, challengee_deck_id: { deck: BatchOfCards} }[]>()

  return isChallenger ? data?.[0]?.deck_id.deck : data?.[0]?.challengee_deck_id.deck;
}