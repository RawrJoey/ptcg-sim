import { HStack } from '@chakra-ui/react';
import { DraggableCard } from './Card/DraggableCard';

interface HandProps {
  // TODO: Make these real cards
  cards: string[];
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
