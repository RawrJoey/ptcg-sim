import { useAppSelector } from "@/app/hooks";
import { useGameChannelListener } from "@/features/game/broadcast/useGameChannelListener";
import { useGameChannelUpdater } from "@/features/game/broadcast/useGameChannelUpdater";
import { useGameController } from "@/features/game/useGameController";
import { useActiveGame } from "@/features/social/challenges/useActiveGame";
import { Board } from "../Board/Board";
import { HelperBubble } from "./HelperBubble";

export const GameController = () => {
  const activeGame = useActiveGame();

  useGameController();
  useGameChannelListener(activeGame?.id);
  useGameChannelUpdater(activeGame?.id);

  return <>
      <HelperBubble />
      <Board isOpponent />
      <Board />
    </>
}