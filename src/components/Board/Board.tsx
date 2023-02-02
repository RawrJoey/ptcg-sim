import { Grid, GridItem } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { CardInterface } from '../Card/CardInterface';
import { getCardDimensions } from '../Card/helpers';
import { DeckOnBoard } from '../Deck/DeckOnBoard';
import { Hand } from '../Hand';
import { Area } from './Area';
import { DiscardPile } from './DiscardPile';

export const Board = () => {
  const [handCards, setHandCards] = useState<CardInterface[]>([
    {
      id: 0,
      name: 'colress',
    },
  ]);

  const drawCard = useCallback(
    (card: CardInterface) => {
      setHandCards([...handCards, card]);
    },
    [handCards, setHandCards]
  );

  const handleMoveCard = (
    card: CardInterface,
    source: Area,
    destination: Area
  ) => {
    if (source === 'deck') {
      // Pop from deck
      if (destination === 'hand') {
        drawCard(card);
      }
    }

    if (source === 'hand') {
      // setHandCards(handCards.filter(({ id }) => id !== card.id));
      if (destination === 'discard') {
        // Push to discard
      }
    }
  };

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
        <DeckOnBoard
          drawCard={() => drawCard({ id: handCards.length, name: 'colress' })}
        />
      </GridItem>
      <GridItem area='hand' height={getCardDimensions('md').height}>
        <Hand cards={handCards} />
      </GridItem>
      <GridItem area='discard'>
        <DiscardPile
          handleMoveCard={handleMoveCard}
          handCards={handCards}
          setHandCards={setHandCards}
        />
      </GridItem>
    </Grid>
  );
};
