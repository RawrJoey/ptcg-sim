import { useDecks } from "./useDecks"

export const useSavedDeck = (userId: string | undefined, deckId: number | undefined) => {
  const { data, ...rest } = useDecks(userId);

  return {
    data: deckId ? data?.find((deck) => deck.id === deckId) : undefined,
    ...rest
  }
}