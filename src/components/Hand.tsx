import { HStack } from '@chakra-ui/react';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { CardInterface, CardObject } from './Card/CardInterface';
import { DraggableCard } from './Card/DraggableCard';
import { DropZone } from './Generic/DropZone';

interface HandProps {
  cards: CardObject[];
}

export const Hand = (props: HandProps) => {
  return (
    <DropZone zone={{ area: 'hand' }}>
      <HStack maxWidth={'100%'} spacing={0} justifyContent='center'>
        {props.cards.map((card) => (
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
