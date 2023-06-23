import { SupabaseClient, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useQuery } from "@tanstack/react-query";

export interface SavedDeck { id?: string, owner?: string, deck: any, name?: string }

const fetchDecks = async (supabase: SupabaseClient, userId: string | undefined) => {
  if (!userId) return [];

  const res = await supabase.from('Decks').select('id,owner,deck,name').eq('owner', userId).returns<SavedDeck[]>();
  return res.data;
}

export const useDecks = (userId: string | undefined) => {
  const supabase = useSupabaseClient();

  return useQuery({
    queryKey: ['saved-decks', userId],
    queryFn: () => fetchDecks(supabase, userId)
  })
}