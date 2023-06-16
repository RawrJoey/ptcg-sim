import { SupabaseClient } from "@supabase/supabase-js"

export const sendChallenge = async (supabaseClient: SupabaseClient, currentUserId: string, challengedUserId: string) => {
  await supabaseClient.from('Challenges')
    .insert({
      challenger: currentUserId,
      challengee: challengedUserId,
      active: true,
      gameIsRunning: false
    });
};

export const acceptChallenge = async (supabaseClient: SupabaseClient, challengeId: number) => {
  const { data, error } = await supabaseClient.from('Challenges')
    .update({ gameIsRunning: true, active: false })
    .eq('id', challengeId);

  if (error) console.error(error)
}