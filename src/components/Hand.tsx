import { HStack } from '@chakra-ui/react';
import { useOpponentContext } from './Board/OpponentContext';
import { useDeck } from './Board/useDeck';
import { Card } from './Card/Card';
import { DraggableCard } from './Card/DraggableCard';
import { DropZone } from './Generic/DropZone';

export const Hand = () => {
  const isOpponent = useOpponentContext();
  const handCards = useDeck().handCards;

  return (
    <DropZone zone={{ area: 'hand' }}>
      <HStack maxWidth={'100%'} spacing={0} justifyContent='center'>
        {handCards.map((card) => (
          isOpponent ?
            <Card          
              card={card}
              key={card.uuid}
              hoverBehavior='float'
              size='md'
              isHidden
            /> :
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
