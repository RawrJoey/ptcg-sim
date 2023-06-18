import { useAppSelector } from '@/app/hooks';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { Subtype, Supertype } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { useOpponentContext } from '../Board/OpponentContext';
import { Card } from './Card';
import { CardInterface, CardObject } from './CardInterface';
import { CardProps } from './CardProps';

export type CardZoneType = 'hand' | 'discard' | 'deck' | 'active' | 'benched' | 'stadium' | 'pokemon' | 'prizes';

export interface CardZone {
  area: CardZoneType;
  metadata?: CardObject;
  // Parent area in the event of a Pokemon
  parentArea?: CardZoneType
}

interface DraggableCardProps extends CardProps {
  onDrag?: () => void;
  onFailedRelease?: () => void;
  cardOrigin: CardZone;
}

export interface DraggableCardType {
  origin: CardZone,
  card: CardObject
}

export const DraggableCard = (props: DraggableCardProps) => {
  const gameHasStarted = useAppSelector((state) => state.game.phase.type === 'your-turn' || state.game.phase.type === 'opponent-turn' || state.game.phase.type === 'game-end');
  const isOpponent = useOpponentContext();

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'card',
      item: {
        origin: props.cardOrigin,
        card: props.card
      },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
      end(draggedItem, monitor) {
        if (props.onFailedRelease && !monitor.didDrop()) {
          props.onFailedRelease();
        }
      },
    }),
    [props.card.id]
  );

  useEffect(() => {
    if (props.onDrag && isDragging) {
      props.onDrag();
    }
  }, [isDragging]);

  const getIsHidden = () => {
    if (props.isHidden !== undefined) return props.isHidden;
    if (isOpponent && !gameHasStarted) return true;
  };

  const shouldDisableDrag = !gameHasStarted && !(props.card.supertype === Supertype.Pokemon && props.card.subtypes.includes(Subtype.Basic));

  const dragProps = {
    ref: drag,
    isDragging
  };

  return <Card {...(shouldDisableDrag ? {} : dragProps)} isHidden={getIsHidden()} {...props} />;
};
