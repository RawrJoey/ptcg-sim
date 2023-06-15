import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loadDeck, setupGame } from '@/features/deck/deckSlice';
import { loadDeckList } from '@/features/deck/helpers';
import { SAMPLE_LIST } from '@/helpers/deck/mocks';
import { parseDeckList } from '@/helpers/deck/parse';
import { useCodeToSetMap } from '@/hooks/useCodeToSetMap';
import { Button, Grid, GridItem, Text, useDisclosure } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { getCardDimensions } from '../Card/helpers';
import { DeckOnBoard } from '../Deck/DeckOnBoard';
import { DeckView } from '../Deck/DeckView';
import { Hand } from '../Hand';
import { ActivePokemon } from '../Pokemon/ActivePokemon';
import { BenchedPokemon } from '../Pokemon/BenchedPokemon';
import { Stadium } from '../Stadium';
import { Area } from './Area';
import { DiscardPile } from './DiscardPile';

export const Board = () => {
  const { handCards, deckCards, discardCards } = useAppSelector((state) => state.deck);
  const dispatch = useAppDispatch();

  const { data: codeToSetMap, isLoading: isCodeToSetMapLoading } = useCodeToSetMap();

  const onApplicationLoad = async() => {
    if (!isCodeToSetMapLoading) {
      const loadedDeckList = await loadDeckList(SAMPLE_LIST, codeToSetMap);

      dispatch(loadDeck(loadedDeckList));
      dispatch(setupGame());
    }
  }

  useEffect(() => {
    onApplicationLoad();
  }, [isCodeToSetMapLoading]);

  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <DeckView isOpen={isOpen} onClose={onClose} onOpen={onOpen} cards={deckCards} />
      <Grid
        templateAreas={`
      "lost-zone stadium active . deck"
      "prizes . . . discard"
      ". bench bench bench ."
      "hand hand hand hand hand"
      `}
        gridTemplateRows={'1fr 1fr 1fr 1fr'}
        gridTemplateColumns={'1fr 1fr 1fr 1fr 1fr'}
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
