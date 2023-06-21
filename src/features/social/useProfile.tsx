import { SupabaseClient, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useQuery } from "@tanstack/react-query"

const fetchProfile = async (supabase: SupabaseClient, userId: string) => {
  const res = await supabase.from('Profiles').select('name,username').eq('id', userId).single();

  return res.data;
}

export const useProfile = (userId: string) => {
  const supabaseClient = useSupabaseClient();

  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchProfile(supabaseClient, userId)
  })
}