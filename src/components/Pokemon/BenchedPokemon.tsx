import { useAppSelector } from "@/app/hooks"
import { HStack } from "@chakra-ui/react";
import { DraggableCard } from "../Card/DraggableCard";
import { DropZone } from "../Generic/DropZone"
import { Pokemon } from "./Pokemon";

export const BenchedPokemon = () => {
  const benched = useAppSelector((state) => state.game.myDeck.benchedPokemon);

  return <DropZone zone={{ area: 'benched' }}>
    <HStack>
      {benched.map(card => <Pokemon card={card} isActive={false} />)}
    </HStack>
  </DropZone>
}