import { useAppDispatch } from '@/app/hooks';
import { discardCard } from '@/features/deck/deckSlice';
import type { CSSProperties, FC, PropsWithChildren } from 'react';
import { useDrop } from 'react-dnd';
import { CardInterface } from '../Card/CardInterface';

import { CardOrigin } from "../Card/DraggableCard"

interface DropZoneProps  extends PropsWithChildren {
  acceptedOrigins: CardOrigin[],
  onDrop: (card: CardInterface) => void,
}

export const DropZone = (props: DropZoneProps) => {
  const dispatch = useAppDispatch();

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: ['hand', 'deck'],
      drop: card => {
        dispatch(discardCard(card as CardInterface));
      },
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