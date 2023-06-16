import { Box } from "@chakra-ui/react";
import { CardObject } from "../Card/CardInterface";
import { CardZone, DraggableCard } from "../Card/DraggableCard";
import { DropZone } from "../Generic/DropZone";

interface PokemonProps {
  card: CardObject;
  isActive: boolean;
}

export const Pokemon = (props: PokemonProps) => {
  const area = props.isActive ? 'active' : 'benched';
  const zone: CardZone = { area: 'pokemon', metadata: props.card, parentArea: area };

  return (
    <DropZone zone={zone}>
      <Box>
        <>
          <Box>
            <DraggableCard cardOrigin={zone} card={props.card} size={props.isActive ? 'lg' : 'md'} hoverBehavior='float' />
          </Box>
          {props.card.energyAttached.map((energy) => (
            <DraggableCard cardOrigin={zone} card={energy} size={props.isActive ? 'md' : 'sm'} hoverBehavior='float' />
          ))}
        </>
      </Box>
    </DropZone>
  )
};