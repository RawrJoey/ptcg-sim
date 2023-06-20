import { useAppSelector } from '@/app/hooks';
import { Button, Grid, GridItem, Text, useDisclosure } from '@chakra-ui/react';
import { getCardDimensions } from '../Card/helpers';
import { DeckOnBoard } from '../Deck/DeckOnBoard';
import { DeckView } from '../Deck/DeckView';
import { Hand } from '../Hand';
import { ActivePokemon } from '../Pokemon/ActivePokemon';
import { BenchedPokemon } from '../Pokemon/BenchedPokemon';
import { Stadium } from '../Stadium';
import { DiscardPile } from './DiscardPile';
import { OpponentContext } from './OpponentContext';
import { Prizes } from './Prizes';
import { useDeck } from './useDeck';

interface BoardProps {
  isOpponent?: boolean;
}

export const Board = (props: BoardProps) => {
  const { deckCards } = useDeck();
  const gamePhase = useAppSelector((state) => state.game.phase.type);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <OpponentContext.Provider value={!!props.isOpponent}>
      <DeckView isOpen={isOpen} onClose={onClose} onOpen={onOpen} cards={deckCards} />
      <Grid
        templateAreas={props.isOpponent ?
          `
      "hand hand hand hand hand"
      "prizes bench bench bench discard"
      "prizes stadium active . deck"
      "lost-zone stadium . . ."
      `
      : `
      "prizes stadium active . deck"
      "prizes bench bench bench discard"
      "hand hand hand hand hand"
      `}
        gridTemplateRows={'1fr 1fr 1fr'}
        gridTemplateColumns={'1fr 1fr 1fr 1fr 1fr'}
        columnGap={4}
        rowGap={4}
        width='100%'
      >
        <GridItem area='active'>
          <ActivePokemon />
        </GridItem>
        <GridItem area='bench'>
          <BenchedPokemon />
        </GridItem>
        <GridItem area='stadium'>
          <Stadium />
        </GridItem>
        <GridItem area='deck'>
          <DeckOnBoard />
          <Button mt='10' onClick={onOpen} isDisabled={gamePhase !== 'your-turn'}>Search deck</Button>
        </GridItem>
        <GridItem area='prizes'>
          <Prizes />
        </GridItem>
        <GridItem area='hand' height={getCardDimensions('md').height}>
          <Hand />
        </GridItem>
        <GridItem area='discard'>
          <DiscardPile />
        </GridItem>
      </Grid>
    </OpponentContext.Provider>
  );
};
