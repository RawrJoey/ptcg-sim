import { HStack } from '@chakra-ui/react';
import { useOpponentContext } from './Board/OpponentContext';
import { useDeck } from './Board/useDeck';
import { DraggableCard } from './Card/DraggableCard';
import { DropZone } from './Generic/DropZone';

export const Hand = () => {
  const isOpponent = useOpponentContext();
  const handCards = useDeck().handCards;

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
            isHidden={!!isOpponent}
          />
        ))}
      </HStack>
    </DropZone>
  );
};
