import { SupabaseClient } from "@supabase/supabase-js"

export const sendChallenge = async (supabaseClient: SupabaseClient, currentUserId: string, challengedUserId: string) => {
  await supabaseClient.from('Challenges')
    .insert({
      challenger: currentUserId,
      challengee: challengedUserId,
      active: true
    });
}