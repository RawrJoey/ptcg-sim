import { useAppSelector } from "@/app/hooks"
import { DraggableCard } from "../Card/DraggableCard";
import { DropZone } from "../Generic/DropZone"

export const ActivePokemon = () => {
  const active = useAppSelector((state) => state.deck.activePokemon);
  console.log(active)

  return <DropZone zone="active" canDrop={!active}>
    {active && <DraggableCard cardOrigin="active" card={active} size='lg' hoverBehavior='bevel' />}
  </DropZone>
}