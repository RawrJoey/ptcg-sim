import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { moveCard } from '@/features/game/gameSlice';
import { Box, useDisclosure } from '@chakra-ui/react';
import { Card } from '../Card/Card';
import { CardInterface } from '../Card/CardInterface';
import { CardModalView } from '../Generic/CardModalView';
import { DropZone } from '../Generic/DropZone';

export const DiscardPile = () => {
  const discardCards = useAppSelector((state) => state.game.myDeck.discardCards);
  const topCardInDiscard = discardCards.at(discardCards.length - 1)
  
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <DropZone zone={{ area: 'discard' }}>
      {topCardInDiscard && (
        <Box onClick={onOpen}>
          <CardModalView cardOrigin={{ area: 'discard' }} isOpen={isOpen} onOpen={onOpen} onClose={onClose} cards={discardCards} />
          <Card card={topCardInDiscard} size='md' hoverBehavior='float' />
        </Box>
      )}
    </DropZone>
  )
};
