import { Button, Grid, GridItem } from '@chakra-ui/react';
import { useState } from 'react';
import { Hand } from './Hand';

export const Board = () => {
  const [handCards, setHandCards] = useState(['colress', 'colress', 'colress']);

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
      <GridItem>
        <Button
          gridArea={'deck'}
          onClick={() => setHandCards([...handCards, 'colress'])}
        >
          Draw
        </Button>
      </GridItem>
      <GridItem gridArea={'hand'}>
        <Hand cards={handCards} />
      </GridItem>
    </Grid>
  );
};
