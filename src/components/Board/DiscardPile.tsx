import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { discardCard } from '@/features/deck/deckSlice';
import { Box, useDisclosure } from '@chakra-ui/react';
import { Card } from '../Card/Card';
import { CardInterface } from '../Card/CardInterface';
import { CardModalView } from '../Generic/CardModalView';
import { DropZone } from '../Generic/DropZone';

export const DiscardPile = () => {
  const discardCards = useAppSelector((state) => state.deck.discardCards);
  const topCardInDiscard = discardCards.at(discardCards.length - 1)
  
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onDrop = (card: CardInterface) => {
    dispatch(discardCard(card));
  };

  return (
    <DropZone zone='discard' onDrop={onDrop}>
      {topCardInDiscard && (
        <Box onClick={onOpen}>
          <CardModalView cardOrigin='discard' isOpen={isOpen} onOpen={onOpen} onClose={onClose} cards={discardCards} />
          <Card card={topCardInDiscard} size='sm' hoverBehavior='float' />
        </Box>
      )}
    </DropZone>
  )
};
