import { SupabaseClient } from "@supabase/supabase-js"

export const sendChallenge = async (supabaseClient: SupabaseClient, currentUserId: string, challengedUserId: string, deckId: string) => {
  await supabaseClient.from('Challenges')
    .insert({
      challenger: currentUserId,
      challengee: challengedUserId,
      active: true,
      gameIsRunning: false,
      deck_id: deckId
    });
};

export const acceptChallenge = async (supabaseClient: SupabaseClient, challengeId: number, deckId: string) => {
  const { data, error } = await supabaseClient.from('Challenges')
    .update({ gameIsRunning: true, active: false, challengee_deck_id: deckId })
    .eq('id', challengeId);

  if (error) console.error(error)
}