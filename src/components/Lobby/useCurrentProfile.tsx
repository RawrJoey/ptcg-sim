import { useUser } from "@supabase/auth-helpers-react"
import { useProfile } from "./useProfile";

export const useCurrentProfile = () => {
  const user = useUser();
  const profile = useProfile(user?.id ?? '');

  return profile;
}