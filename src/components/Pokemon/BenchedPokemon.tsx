import { useAppSelector } from "@/app/hooks"
import { Box, HStack } from "@chakra-ui/react";
import { DraggableCard } from "../Card/DraggableCard";
import { DropZone } from "../Generic/DropZone"
import { Pokemon } from "./Pokemon";

export const BenchedPokemon = () => {
  const benched = useAppSelector((state) => state.game.myDeck.benchedPokemon);

  return (
    <HStack>
      {benched.map(card => <Pokemon card={card} isActive={false} />)}
      <Box flexGrow={1}>
        <DropZone zone={{ area: 'benched' }} />
      </Box>
    </HStack> 
  )
}