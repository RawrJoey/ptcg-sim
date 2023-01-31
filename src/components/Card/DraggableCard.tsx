import { useDrag } from 'react-dnd';
import { Card } from './Card';
import { CardProps } from './CardProps';

interface DropResult {
  name: string;
}

export const DraggableCard = (props: CardProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { name: 'colress' },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
        alert(`You dropped ${item.name} into ${dropResult.name}!`);
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  return <Card ref={drag} {...props} />;
};
