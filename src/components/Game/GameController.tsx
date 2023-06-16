import { useChannelReceiver } from "@/features/game/broadcast/useChannelReceiver";
import { useChannelSender } from "@/features/game/broadcast/useChannelSender";
import { useGameController } from "@/features/game/useGameController";
import { Board } from "../Board/Board";
import { HelperBubble } from "./HelperBubble";

export const GameController = () => {
  useGameController();
  useChannelReceiver();
  useChannelSender();

  return <>
      <HelperBubble />
      <Board />
    </>
}