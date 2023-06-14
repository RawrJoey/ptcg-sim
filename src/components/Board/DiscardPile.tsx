import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { discardCard } from '@/features/deck/deckSlice';
import { Card } from '../Card/Card';
import { CardInterface } from '../Card/CardInterface';
import { DropZone } from '../Generic/DropZone';

export const DiscardPile = () => {
  const topCardInDiscard = useAppSelector((state) => state.deck.discardCards.at(state.deck.discardCards.length - 1));
  const dispatch = useAppDispatch();
  const onDrop = (card: CardInterface) => {
    dispatch(discardCard(card));
  };

  return <DropZone acceptedOrigins={['hand', 'deck']} onDrop={onDrop}>
    {topCardInDiscard && <Card card={topCardInDiscard} size='sm' hoverBehavior='float' />}
  </DropZone>
};
