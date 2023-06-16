import { useChallenges } from "./useChallenges"

export const useActiveChallenges = (userId: string | undefined) => {
  const { data, ...rest } = useChallenges(userId);

  return {
    data: data?.filter(({ active }) => active),
    ...rest
  }
}