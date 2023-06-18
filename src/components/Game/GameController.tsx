import { useGameChannelSubscribe } from "@/features/game/broadcast/useGameChannelSubscribe";
import { useGameController } from "@/features/game/useGameController";
import { useActiveGame } from "@/features/social/challenges/useActiveGame";
import { Board } from "../Board/Board";
import { HelperBubble } from "./HelperBubble";

export const GameController = () => {
  const activeGame = useActiveGame();

  useGameController();
  useGameChannelSubscribe(activeGame?.id);

  return <>
      <Board isOpponent />
      <HelperBubble />
      <Board />
    </>
}