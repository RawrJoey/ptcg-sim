import { HStack } from '@chakra-ui/react';
import { CardInterface } from './Card/CardInterface';
import { DraggableCard } from './Card/DraggableCard';

interface HandProps {
  cards: CardInterface[];
}

export const Hand = (props: HandProps) => {
  return (
    <HStack maxWidth={'100%'} spacing={0} justifyContent='center'>
      {props.cards.map((card, key) => (
        <DraggableCard
          key={key}
          hoverBehavior='float'
          size='md'
          entranceBehavior='draw'
        />
      ))}
    </HStack>
  );
};
