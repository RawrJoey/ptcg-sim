import { useAppSelector } from "@/app/hooks";
import { useOpponentContext } from "./OpponentContext"

export const useDeck = () => {
  const isOpponent = useOpponentContext();
  const game = useAppSelector((state) => state.game);

  if (isOpponent) return game.opponentDeck;
  return game.myDeck;
}