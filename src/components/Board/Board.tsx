import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Button, Grid, GridItem, Text, useDisclosure } from '@chakra-ui/react';
import { getCardDimensions } from '../Card/helpers';
import { DeckOnBoard } from '../Deck/DeckOnBoard';
import { DeckView } from '../Deck/DeckView';
import { Hand } from '../Hand';
import { ActivePokemon } from '../Pokemon/ActivePokemon';
import { BenchedPokemon } from '../Pokemon/BenchedPokemon';
import { Stadium } from '../Stadium';
import { DiscardPile } from './DiscardPile';
import { Prizes } from './Prizes';

export const Board = () => {
  const { handCards, deckCards, discardCards } = useAppSelector((state) => state.game.myDeck);
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <DeckView isOpen={isOpen} onClose={onClose} onOpen={onOpen} cards={deckCards} />
      <Grid
        templateAreas={`
      "lost-zone stadium . . ."
      "prizes stadium active . deck"
      "prizes bench bench bench discard"
      "hand hand hand hand hand"
      `}
        gridTemplateRows={'0.5fr 2fr 1fr 1fr'}
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
          <Text>Deck: {deckCards.length}</Text>
          <DeckOnBoard />
          <Button mt='10' onClick={onOpen}>Search deck</Button>
        </GridItem>
        <GridItem area='prizes'>
          <Prizes />
        </GridItem>
        <GridItem area='hand' height={getCardDimensions('md').height}>
          <Hand cards={handCards} />
        </GridItem>
        <GridItem area='discard'>
          <Text>Discard: {discardCards.length}</Text>
          <DiscardPile />
        </GridItem>
      </Grid>
    </>
  );
};
