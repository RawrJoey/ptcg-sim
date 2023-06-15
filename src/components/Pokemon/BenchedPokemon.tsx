import { useAppSelector } from "@/app/hooks"
import { HStack } from "@chakra-ui/react";
import { DraggableCard } from "../Card/DraggableCard";
import { DropZone } from "../Generic/DropZone"

export const BenchedPokemon = () => {
  const benched = useAppSelector((state) => state.game.myDeck.benchedPokemon);

  return <DropZone zone="benched">
    <HStack>
      {benched.map(card => <DraggableCard key={card.uuid} cardOrigin="benched" card={card} size='md' hoverBehavior='float' />)}
    </HStack>
  </DropZone>
}