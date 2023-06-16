import { useAppDispatch } from '@/app/hooks';
import { Box, Text, useDisclosure } from '@chakra-ui/react';
import { Card } from '../Card/Card';
import { CardModalView } from '../Generic/CardModalView';
import { DropZone } from '../Generic/DropZone';
import { useDeck } from './useDeck';

export const DiscardPile = () => {
  const discardCards = useDeck().discardCards;
  const topCardInDiscard = discardCards.at(discardCards.length - 1)
  
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <DropZone zone={{ area: 'discard' }}>
      <Text>Discard: {discardCards.length}</Text>
      {topCardInDiscard && (
        <Box onClick={onOpen}>
          <CardModalView cardOrigin={{ area: 'discard' }} isOpen={isOpen} onOpen={onOpen} onClose={onClose} cards={discardCards} />
          <Card card={topCardInDiscard} size='sm' hoverBehavior='float' />
        </Box>
      )}
    </DropZone>
  )
};
