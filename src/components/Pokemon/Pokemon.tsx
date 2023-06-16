import { Box, HStack } from "@chakra-ui/react";
import { CardObject } from "../Card/CardInterface";
import { CardZone, DraggableCard } from "../Card/DraggableCard";
import { DropZone } from "../Generic/DropZone";

interface PokemonProps {
  card: CardObject;
  isActive: boolean;
}

export const Pokemon = (props: PokemonProps) => {
  const area = props.isActive ? 'active' : 'benched';
  const pokemonZone: CardZone = { area: 'pokemon', metadata: props.card, parentArea: area };
  const activeBenchedZone: CardZone = { area, metadata: props.card };

  return (
    <DropZone zone={pokemonZone}>
      <HStack spacing={props.isActive ? '-200' : '-125'}>
        {props.card.toolsAttached.concat(props.card.energyAttached).map((attached, idx) => (
          <Box>
            <DraggableCard cardOrigin={pokemonZone} card={attached} size={props.isActive ? 'lg' : 'md'} hoverBehavior='float' />
          </Box>
        ))}
        <Box>
          <DraggableCard cardOrigin={activeBenchedZone} card={props.card} size={props.isActive ? 'lg' : 'md'} hoverBehavior='float' />
        </Box>
        {props.card.evolvedPokemonAttached.map((attached, idx) => (
          <Box>
            <DraggableCard cardOrigin={pokemonZone} card={attached} size={props.isActive ? 'lg' : 'md'} hoverBehavior='float' />
          </Box>
        ))}
      </HStack>
    </DropZone>
  )
};