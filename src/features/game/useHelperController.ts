import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { GamePhase } from "./types/Game";
import { usePhaseActions } from "./usePhaseActions";

export interface HelperAction {
  text: string;
  onClick: () => void;
}

interface HelperControllerReturn {
  text?: string;
  actions?: HelperAction[];
  isDisabled: boolean;
}

const getBubbleInterface = (phase: GamePhase, opponentPhase: GamePhase): { text?: string, actions?: HelperAction[] } | undefined => {
  const { confirmHelperAction, flipCoin, chooseFirst } = usePhaseActions();
  const waitingForOpponent = opponentPhase.status === 'pending' || opponentPhase.status === 'pending-input';

  if (phase.type === 'not-started') {
    if (waitingForOpponent) {
      return {
        text: 'Waiting for opponent to load game...'
      }
    }
  }

  if (phase.type === 'flip-coin') {
    if (phase.status === 'pending-input') {
      return {
        text: 'Heads or tails?',
        actions: [{
          text: 'Heads',
          onClick: () => flipCoin('heads')
        }, {
          text: 'Tails',
          onClick: () => flipCoin('tails')
        }]
      }
    }

    if (waitingForOpponent) {
      return {
        text: 'Waiting for opponent to flip...'
      }
    }
  }

  if (phase.type === 'choose-going-first') {
    if (phase.status === 'pending-input') {
      return {
        text: 'You won the flip. First or second?',
        actions: [{
          text: 'First',
          onClick: () => chooseFirst(true)
        }, {
          text: 'Second',
          onClick: () => chooseFirst(false)
        }]
      }
    }

    if (waitingForOpponent) {
      return {
        text: 'You lost the flip. Waiting for opponent to choose turn order...'
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
    return {
      text: 'Choose your starting Pokemon',
      actions: [{
        text: 'Done',
        onClick: confirmHelperAction
      }]
    }
  }

  if (phase.type === 'mulligan') {
    return {
      text: 'You have a mulligan',
      actions: [{
        text: 'Get a new hand',
        onClick: confirmHelperAction
      }]
    }
  }

  if (phase.type === 'your-turn') {
    return {
      text: 'Your turn'
    }
  }

  if (waitingForOpponent) {
    if (opponentPhase.type === 'choose-active') {
      return {
        text: 'Waiting for opponent to choose starting Pokemon...'
      }
    }
  }
}

export const useHelperController = () => {
  const gameState = useAppSelector((state) => state.game);
  const bubbleInterface = getBubbleInterface(gameState.phase, gameState.opponentPhase);

  const ret: HelperControllerReturn = {
    text: bubbleInterface?.text,
    actions: bubbleInterface?.actions,
    isDisabled: gameState.phase.status === 'pending-input'
  }

  return ret;
}