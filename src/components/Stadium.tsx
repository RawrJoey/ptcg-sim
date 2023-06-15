import { useAppSelector } from "@/app/hooks";
import { DraggableCard } from "./Card/DraggableCard";
import { DropZone } from "./Generic/DropZone";

export const Stadium = () => {
  const stadium = useAppSelector((state) => state.deck.activePokemon);

  return <DropZone zone="stadium">
    {stadium && <DraggableCard cardOrigin="active" card={stadium} size='md' hoverBehavior='float' />}
  </DropZone>
}