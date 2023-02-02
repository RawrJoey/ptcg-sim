import { useDrag } from 'react-dnd';
import { Card } from './Card';
import { CardProps } from './CardProps';

export const DraggableCard = (props: CardProps) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'card',
      item: props.card,
      collect: monitor => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
    }),
    [props.card.id]
  );

  return <Card ref={drag} isDragging={isDragging} {...props} />;
};
