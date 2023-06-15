import { CardObject } from "../Card/CardInterface";
import { DraggableCard } from "../Card/DraggableCard";
import { DropZone } from "../Generic/DropZone";

interface PokemonProps {
  card: CardObject;
  isActive: boolean;
}

export const Pokemon = (props: PokemonProps) => {
  return (
    <DropZone zone={{ area: 'active', metadata: props.card }}>
      <DraggableCard cardOrigin={{ area: props.isActive ? 'active' : 'benched', metadata: props.card }} card={props.card} size={props.isActive ? 'lg' : 'md'} hoverBehavior='float' />
    </DropZone>
  )
};