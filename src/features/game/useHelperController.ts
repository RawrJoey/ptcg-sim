import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { GamePhase } from "./types/Game";

const getBubbleInterface = (phase: GamePhase, opponentPhase: GamePhase) => {
  const waitingForOpponent = phase.status === 'ok' && opponentPhase.status === 'pending';

  if (phase.type === 'not-started') {
    if (waitingForOpponent) {
      return {
        text: 'Waiting for opponent to load game...'
      }
    }
  }

  if (phase.type === 'initialize') {
    if (waitingForOpponent) {
      return {
        text: 'Waiting for opponent client to initialize...'
      }
    }
  }

  if (phase.type === 'initial-draw') {
    if (waitingForOpponent) {
      return {
        text: 'Waiting for opponent to draw seven...'
      }
    }
  }

  if (phase.type === 'choose-active') {
    if (waitingForOpponent) {
      return {
        text: 'Waiting for opponent to choose active...'
      }
    }

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
  const bubbleInterface = getBubbleInterface(gameState.phase, gameState.opponentPhase);

  return {
    text: bubbleInterface?.text,
    actionText: bubbleInterface?.actionText,
    isDisabled: gameState.phase.status === 'pending-input'
  }
}