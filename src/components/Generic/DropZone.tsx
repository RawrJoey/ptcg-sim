import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { moveCard } from '@/features/deck/deckSlice';
import type { CSSProperties, FC, PropsWithChildren } from 'react';
import { useDrop } from 'react-dnd';
import { CardInterface } from '../Card/CardInterface';
import { CardZone, DraggableCardType } from '../Card/DraggableCard';
import { Subtype } from 'pokemon-tcg-sdk-typescript/dist/sdk';

interface DropZoneProps  extends PropsWithChildren {
  zone: CardZone;
}

export const DropZone = (props: DropZoneProps) => {
  const dispatch = useAppDispatch();
  const active = useAppSelector((state) => state.deck.activePokemon);
  const benched = useAppSelector((state) => state.deck.benchedPokemon);


  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: 'card',
      canDrop(item, monitor) {
        const origin = (monitor.getItem() as DraggableCardType).origin;

        const canDropIntoPokemonZone = (monitor.getItem() as DraggableCardType).card.subtypes.includes(Subtype.Basic);
        if (props.zone === 'active') {
          if (origin === 'benched') return true;
          if (!canDropIntoPokemonZone || active) return false;
        };

        if (props.zone === 'benched') {
          if (!canDropIntoPokemonZone || benched.length >= 5) return false;
        }
        
        if (origin !== props.zone) {
          return true;
        }

        return false;
      },
      drop: (draggingCard: DraggableCardType) => dispatch(moveCard({ card: draggingCard.card, origin: draggingCard.origin, destination: props.zone })),
      collect: monitor => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [active, props.zone, benched]
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