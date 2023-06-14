import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { Card } from './Card';
import { CardProps } from './CardProps';

export type CardOrigin = 'hand' | 'discard' | 'deck';

interface DraggableCardProps extends CardProps {
  onDrag?: () => void;
  onFailedRelease?: () => void;
  cardOrigin: CardOrigin
}

export const DraggableCard = (props: DraggableCardProps) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: props.cardOrigin,
      item: props.card,
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
