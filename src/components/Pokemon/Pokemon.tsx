import { CardObject } from "../Card/CardInterface";
import { DraggableCard } from "../Card/DraggableCard";
import { DropZone } from "../Generic/DropZone";

interface PokemonProps {
  card: CardObject;
  isActive: boolean;
}

export const Pokemon = (props: PokemonProps) => {
  const area = props.isActive ? 'active' : 'benched';
  console.log(props.card)

  return (
    <DropZone zone={{ area: 'pokemon', metadata: props.card, parentArea: area }}>
      <DraggableCard cardOrigin={{ area: area, metadata: props.card }} card={props.card} size={props.isActive ? 'lg' : 'md'} hoverBehavior='float' />
    </DropZone>
  )
};