import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loadDeck, setupGame } from '@/features/deck/deckSlice';
import { SAMPLE_LIST } from '@/helpers/deck/mocks';
import { parseDeckList } from '@/helpers/deck/parse';
import { useCodeToSetMap } from '@/hooks/useCodeToSetMap';
import { Grid, GridItem, Text, useDisclosure } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { getCardDimensions } from '../Card/helpers';
import { DeckOnBoard } from '../Deck/DeckOnBoard';
import { DeckView } from '../Deck/DeckView';
import { Hand } from '../Hand';
import { Area } from './Area';
import { DiscardPile } from './DiscardPile';

export const Board = () => {
  const { handCards, deckCards, discardCards } = useAppSelector((state) => state.deck);
  const dispatch = useAppDispatch();

  const { data: codeToSetMap, isLoading: isCodeToSetMapLoading } = useCodeToSetMap();

  useEffect(() => {
    if (!isCodeToSetMapLoading) {
      dispatch(loadDeck(parseDeckList(SAMPLE_LIST, codeToSetMap)));
      dispatch(setupGame());
    }
  }, [isCodeToSetMapLoading]);

  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <DeckView isOpen={isOpen} onClose={onClose} onOpen={onOpen} cards={deckCards} />
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
          <DeckOnBoard />
          <Text>Deck: {deckCards.length}</Text>
          <button onClick={onOpen}>Open deck</button>
        </GridItem>
        <GridItem area='hand' height={getCardDimensions('md').height}>
          <Hand cards={handCards} />
        </GridItem>
        <GridItem area='discard'>
          <DiscardPile />
          <Text>Discard: {discardCards.length}</Text>
        </GridItem>
      </Grid>
    </>
  );
};
