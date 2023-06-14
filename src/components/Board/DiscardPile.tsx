import { useAppDispatch } from '@/app/hooks';
import { discardCard } from '@/features/deck/deckSlice';
import type { CSSProperties, FC } from 'react';
import { useDrop } from 'react-dnd';
import { CardInterface } from '../Card/CardInterface';
import { Area } from './Area';

const style: CSSProperties = {
  height: '100%',
  width: '100%',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left',
};

export const DiscardPile = () => {
  const dispatch = useAppDispatch();

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: 'card',
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
  let backgroundColor = '#222';
  if (isActive) {
    backgroundColor = 'darkgreen';
  } else if (canDrop) {
    backgroundColor = 'darkkhaki';
  }

  return (
    <div ref={drop} style={{ ...style, backgroundColor }} data-testid='dustbin'>
      {isActive ? 'Release to drop' : 'Drag a box here'}
    </div>
  );
};
