import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { moveCard } from '@/features/game/gameSlice';
import type { CSSProperties, FC, PropsWithChildren } from 'react';
import { useDrop } from 'react-dnd';
import { CardInterface, CardObject } from '../Card/CardInterface';
import { CardZone, DraggableCardType } from '../Card/DraggableCard';
import { Subtype, Supertype } from 'pokemon-tcg-sdk-typescript/dist/sdk';

interface DropZoneProps  extends PropsWithChildren {
  zone: CardZone;
}

export const DropZone = (props: DropZoneProps) => {
  const dispatch = useAppDispatch();
  const active = useAppSelector((state) => state.game.myDeck.activePokemon);
  const benched = useAppSelector((state) => state.game.myDeck.benchedPokemon);

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: 'card',
      canDrop(item, monitor) {
        const origin = (monitor.getItem() as DraggableCardType).origin;

        const card = (monitor.getItem() as DraggableCardType).card;
        const canDropIntoPokemonZone = card.supertype === Supertype.Pokemon && card.subtypes.includes(Subtype.Basic);
        if (props.zone.area === 'active') {
          if (origin.area === 'benched') return true;
          if (!canDropIntoPokemonZone || active) return false;
        };

        if (props.zone.area === 'benched') {
          if (!canDropIntoPokemonZone || benched.length >= 5) return false;
        }

        if (props.zone.area === 'stadium') {
          if (!card.subtypes.includes(Subtype.Stadium)) return false;
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