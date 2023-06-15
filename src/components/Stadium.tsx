import { useAppSelector } from "@/app/hooks";
import { DraggableCard } from "./Card/DraggableCard";
import { DropZone } from "./Generic/DropZone";

export const Stadium = () => {
  const stadium = useAppSelector((state) => state.game.myDeck.stadium);

  return <DropZone zone={{ area: 'stadium' }}>
    {stadium && <DraggableCard cardOrigin={{ area: 'stadium' }} card={stadium} size='md' hoverBehavior='float' />}
  </DropZone>
}