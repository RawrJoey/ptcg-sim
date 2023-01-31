import { Grid, GridItem } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { DeckOnBoard } from '../Deck/DeckOnBoard';
import { Hand } from '../Hand';
import { DiscardPile } from './DiscardPile';

export const Board = () => {
  const [handCards, setHandCards] = useState(['colress', 'colress', 'colress']);

  const drawCard = useCallback(() => {
    setHandCards([...handCards, 'colress']);
  }, [handCards, setHandCards]);

  return (
    <Grid
      templateAreas={`
    "lost-zone . . . deck"
    "prizes . active . discard"
    ". bench bench bench ."
    "hand hand hand hand hand"
    `}
      gridTemplateRows={'1fr 1fr 1fr'}
      gridTemplateColumns={'1fr 5fr 1fr'}
      width='100%'
    >
      <GridItem area='deck'>
        <DeckOnBoard drawCard={drawCard} />
      </GridItem>
      <GridItem area='hand'>
        <Hand cards={handCards} />
      </GridItem>
      <GridItem area='discard'>
        <DiscardPile />
      </GridItem>
    </Grid>
  );
};
