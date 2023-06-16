import { useAppSelector } from '@/app/hooks';
import { HStack } from '@chakra-ui/react';
import { DraggableCard } from './Card/DraggableCard';
import { DropZone } from './Generic/DropZone';

export const Hand = () => {
  const handCards = useAppSelector((state) => state.game.myDeck.handCards);

  return (
    <DropZone zone={{ area: 'hand' }}>
      <HStack maxWidth={'100%'} spacing={0} justifyContent='center'>
        {handCards.map((card) => (
          <DraggableCard
            card={card}
            key={card.uuid}
            hoverBehavior='float'
            size='md'
            entranceBehavior='draw'
            cardOrigin={{ area: 'hand' }}
          />
        ))}
      </HStack>
    </DropZone>
  );
};
