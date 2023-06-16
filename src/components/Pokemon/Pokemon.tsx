import { Box } from "@chakra-ui/react";
import { CardObject } from "../Card/CardInterface";
import { DraggableCard } from "../Card/DraggableCard";
import { DropZone } from "../Generic/DropZone";

interface PokemonProps {
  card: CardObject;
  isActive: boolean;
}

export const Pokemon = (props: PokemonProps) => {
  const area = props.isActive ? 'active' : 'benched';

  return (
    <DropZone zone={{ area: 'pokemon', metadata: props.card, parentArea: area }}>
      <Box>
        <DraggableCard cardOrigin={{ area: area, metadata: props.card }} card={props.card} size={props.isActive ? 'lg' : 'md'} hoverBehavior='float' />
      </Box>
    </DropZone>
  )
};