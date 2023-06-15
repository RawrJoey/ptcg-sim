import { useAppSelector } from "@/app/hooks";
import { DraggableCard } from "./Card/DraggableCard";
import { DropZone } from "./Generic/DropZone";

export const Stadium = () => {
  const stadium = useAppSelector((state) => state.game.myDeck.stadium);

  return <DropZone zone="stadium">
    {stadium && <DraggableCard cardOrigin="stadium" card={stadium} size='md' hoverBehavior='float' />}
  </DropZone>
}