import { useDrag } from 'react-dnd';
import { Card } from './Card';
import { DraggableCardProps } from './CardProps';

interface DropResult {
  name: string;
}

export const DraggableCard = (props: DraggableCardProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: props.card,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();

      if (dropResult) {
        props.handleMoveCard(props.card, 'hand', dropResult.name);
      }

      if (item && dropResult) {
        alert(`You dropped ${item.name} into ${dropResult.name}!`);
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  return <Card ref={drag} isDragging={isDragging} {...props} />;
};
