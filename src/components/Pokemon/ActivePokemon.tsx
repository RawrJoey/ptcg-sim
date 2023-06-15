import { useAppSelector } from "@/app/hooks"
import { DraggableCard } from "../Card/DraggableCard";
import { DropZone } from "../Generic/DropZone"

export const ActivePokemon = () => {
  const active = useAppSelector((state) => state.deck.activePokemon);

  return <DropZone zone="active" canDrop={!active}>
    {active && <DraggableCard cardOrigin="active" card={active} size='lg' hoverBehavior='float' />}
  </DropZone>
}