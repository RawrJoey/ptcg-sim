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

interface DiscardPileProps {
  handleMoveCard: (
    card: CardInterface,
    source: Area,
    destination: Area
  ) => void;
  handCards: CardInterface[];
  setHandCards: (handCards: CardInterface[]) => void;
}

export const DiscardPile = (props: DiscardPileProps) => {
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: 'card',
      drop: card => {
        props.handleMoveCard(card as CardInterface, 'hand', 'discard');
        props.setHandCards(
          props.handCards.filter(({ id }) => id !== (card as CardInterface).id)
        );
      },
      collect: monitor => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [props.handCards]
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
