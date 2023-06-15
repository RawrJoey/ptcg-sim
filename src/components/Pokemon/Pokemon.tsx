import { CardObject } from "../Card/CardInterface";
import { DraggableCard } from "../Card/DraggableCard";
import { DropZone } from "../Generic/DropZone";

interface PokemonProps {
  card: CardObject;
  isActive: boolean;
}

export const Pokemon = (props: PokemonProps) => {
  return (
    <DropZone zone='pokemon' cardMetadata={props.card}>
      <DraggableCard cardOrigin={props.isActive ? 'active' : 'benched'} card={props.card} size={props.isActive ? 'lg' : 'md'} hoverBehavior='float' />
    </DropZone>
  )
};