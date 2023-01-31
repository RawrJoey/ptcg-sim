import { Button, Grid, GridItem } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { BlankCard } from './Card/BlankCard';
import { DeckOnBoard } from './Deck/DeckOnBoard';
import { Hand } from './Hand';

export const Board = () => {
  const [handCards, setHandCards] = useState(['colress', 'colress', 'colress']);

  const drawCard = useCallback(() => {
    setHandCards([...handCards, 'colress']);
  }, [handCards, setHandCards]);

  return (
    <Grid
      templateAreas={`
    "prizes . active . deck"
    ". bench bench bench discard"
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
    </Grid>
  );
};
