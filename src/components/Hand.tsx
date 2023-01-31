import { HStack } from '@chakra-ui/react';
import Draggable from 'react-draggable';
import { Card } from './Card/Card';

interface HandProps {
  // TODO: Make these real cards
  cards: string[];
}

export const Hand = (props: HandProps) => {
  return (
    <HStack maxWidth={'100%'} spacing={0} justifyContent='center'>
      {props.cards.map((card, key) => (
        <Card
          key={key}
          hoverBehavior='float'
          size='md'
          entranceBehavior='draw'
        />
      ))}
    </HStack>
  );
};
