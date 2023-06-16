import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
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

  return <Card ref={drag} isDragging={isDragging} {...props} />;
};
