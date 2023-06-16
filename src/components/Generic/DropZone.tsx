import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { moveCard } from '@/features/game/gameSlice';
import type { CSSProperties, FC, PropsWithChildren } from 'react';
import { useDrop } from 'react-dnd';
import { CardInterface, CardObject } from '../Card/CardInterface';
import { CardZone, DraggableCardType } from '../Card/DraggableCard';
import { Subtype, Supertype } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import { getAttachmentType } from '@/features/game/helpers';
import { useInfoToast } from '@/hooks/useInfoToast';
import { useDeck } from '../Board/useDeck';
import { useOpponentContext } from '../Board/OpponentContext';

interface DropZoneProps  extends PropsWithChildren {
  zone: CardZone;
}

export const DropZone = (props: DropZoneProps) => {
  const isOpponent = useOpponentContext();
  const dispatch = useAppDispatch();
  const active = useDeck().activePokemon;
  const benched = useDeck().benchedPokemon;
  const gamePhase = useAppSelector((state) => state.game.phase.type);
  const toast = useInfoToast();

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: 'card',
      canDrop(item, monitor) {
        // But Head Ringer!!!!
        if (isOpponent) return false;

        const origin = (monitor.getItem() as DraggableCardType).origin;

        const card = (monitor.getItem() as DraggableCardType).card;
        const canDropIntoPokemonZone = card.supertype === Supertype.Pokemon && card.subtypes.includes(Subtype.Basic);

        if (gamePhase !== 'your-turn') {
          if (origin.area === 'prizes' || props.zone.area === 'discard') return false;
        }

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

        if (props.zone.area === 'pokemon') {
          if (origin.area === 'active') return false;
          if (origin.area === 'benched') return false;
          if (origin.metadata?.uuid === props.zone.metadata?.uuid) return false;

          const attachmentType = getAttachmentType(card);
          if (!attachmentType) return false;
        }

        if (origin.area === 'prizes') return props.zone.area === 'hand'; // Yeah yeah Blaceph GX whatever
        
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