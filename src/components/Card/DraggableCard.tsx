import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { Card } from './Card';
import { CardProps } from './CardProps';

interface DraggableCardProps extends CardProps {
  onDrag?: () => void;
  onFailedRelease?: () => void;
}

export const DraggableCard = (props: DraggableCardProps) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'card',
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
