import { HStack } from '@chakra-ui/react';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { CardInterface } from './Card/CardInterface';
import { DraggableCard } from './Card/DraggableCard';
import { DropZone } from './Generic/DropZone';

interface HandProps {
  cards: PokemonTCG.Card[];
}

export const Hand = (props: HandProps) => {
  return (
    <DropZone zone='hand'>
      <HStack maxWidth={'100%'} spacing={0} justifyContent='center'>
        {props.cards.map((card) => (
          <DraggableCard
            card={card}
            key={card.id}
            hoverBehavior='float'
            size='md'
            entranceBehavior='draw'
            cardOrigin='hand'
          />
        ))}
      </HStack>
    </DropZone>
  );
};
