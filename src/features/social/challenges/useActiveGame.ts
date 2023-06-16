import { useUser } from "@supabase/auth-helpers-react"
import { useChallenges } from "./useChallenges"

export const useActiveGame = () => {
  const user = useUser();
  const { data: challenges } = useChallenges(user?.id);

  return challenges?.find(({ gameIsRunning }) => gameIsRunning);
}