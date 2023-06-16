import { Box, HStack } from "@chakra-ui/react";
import { useDeck } from "../Board/useDeck";
import { DropZone } from "../Generic/DropZone"
import { Pokemon } from "./Pokemon";

export const BenchedPokemon = () => {
  const benched = useDeck().benchedPokemon;

  return (
    <HStack>
      {benched.map(card => <Pokemon key={card.uuid} card={card} isActive={false} />)}
      <Box flexGrow={1}>
        <DropZone zone={{ area: 'benched' }} />
      </Box>
    </HStack> 
  )
}