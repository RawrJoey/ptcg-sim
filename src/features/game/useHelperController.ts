import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { GamePhase, setGamePhase } from "./gameSlice";

const getBubbleInterface = (phase: GamePhase) => {
  if (phase.type === 'choose-active') {
    return {
      text: 'Choose your starting Pokemon',
      actionText: 'Done'
    }
  }

  if (phase.type === 'mulligan') {
    return {
      text: 'You have a mulligan',
      actionText: 'Get new hand'
    }
  }

  if (phase.type === 'your-turn') {
    return {
      text: 'Your turn'
    }
  }
}

export const useHelperController = () => {
  const gameState = useAppSelector((state) => state.game);
  const bubbleInterface = getBubbleInterface(gameState.phase);

  return {
    text: bubbleInterface?.text,
    actionText: bubbleInterface?.actionText,
    isDisabled: gameState.phase.status === 'pending-user-input'
  }
}