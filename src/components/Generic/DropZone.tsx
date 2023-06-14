import { useAppDispatch } from '@/app/hooks';
import { moveCard } from '@/features/deck/deckSlice';
import type { CSSProperties, FC, PropsWithChildren } from 'react';
import { useDrop } from 'react-dnd';
import { CardInterface } from '../Card/CardInterface';
import { CardZone, DraggableCardType } from '../Card/DraggableCard';

interface DropZoneProps  extends PropsWithChildren {
  zone: CardZone,
}

export const DropZone = (props: DropZoneProps) => {
  const dispatch = useAppDispatch();

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: 'card',
      canDrop(item, monitor) {
        if ((monitor.getItem() as DraggableCardType).origin === props.zone) {
          return false;
        }
        return true;
      },
      drop: (draggingCard: DraggableCardType) => dispatch(moveCard({ card: draggingCard.card, origin: draggingCard.origin, destination: props.zone })),
      collect: monitor => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    []
  );

  const isActive = canDrop && isOver;
  let backgroundColor = 'transparent';
  if (isActive) {
    backgroundColor = 'darkgreen';
  } else if (canDrop) {
    backgroundColor = 'darkkhaki';
  }

  return (
    <div ref={drop} style={{ backgroundColor, height: '139.6px' }} data-testid='dustbin'>
      {props.children}
    </div>
  );
}