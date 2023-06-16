import { useDeck } from "./Board/useDeck";
import { DraggableCard } from "./Card/DraggableCard";
import { DropZone } from "./Generic/DropZone";

export const Stadium = () => {
  // TODO: Stadium is actually shared
  const stadium = useDeck().stadium;

  return <DropZone zone={{ area: 'stadium' }}>
    {stadium && <DraggableCard cardOrigin={{ area: 'stadium' }} card={stadium} size='md' hoverBehavior='float' />}
  </DropZone>
}