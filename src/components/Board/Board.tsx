import { SAMPLE_LIST } from '@/helpers/deck/mocks';
import { parseDeckList } from '@/helpers/deck/parse';
import { useCodeToSetMap } from '@/hooks/useCodeToSetMap';
import { Grid, GridItem, Text, useDisclosure } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { CardInterface } from '../Card/CardInterface';
import { getCardDimensions } from '../Card/helpers';
import { DeckOnBoard } from '../Deck/DeckOnBoard';
import { DeckView } from '../Deck/DeckView';
import { Hand } from '../Hand';
import { Area } from './Area';
import { DiscardPile } from './DiscardPile';

export const Board = () => {
  const [handCards, setHandCards] = useState<CardInterface[]>([
    {
      id: 0,
      name: 'colress',
      imageUrl: 'https://images.pokemontcg.io/swsh12pt5gg/GG59_hires.png'
    },
  ]);
  const [discardCards, setDiscardCards] = useState<CardInterface[]>([]);
  const [deckCards, setDeckCards] = useState<CardInterface[]>([]);

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
      setHandCards(handCards.filter(({ id }) => id !== card.id));

      if (destination === 'discard') {
        setDiscardCards([...discardCards, card])
      }
    }
  };

  const { data: codeToSetMap, isLoading: isCodeToSetMapLoading } = useCodeToSetMap();

  useEffect(() => {
    if (!isCodeToSetMapLoading) {
      const deck = parseDeckList(SAMPLE_LIST, codeToSetMap);
      console.log(deck)
      setDeckCards(deck);
    }
  }, [isCodeToSetMapLoading]);

  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <DeckView isOpen={isOpen} onClose={onClose} deck={deckCards} />
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
            drawCard={() => drawCard({ id: Math.random(), name: 'colress', imageUrl: 'https://images.pokemontcg.io/swsh12pt5gg/GG59_hires.png' })}
          />
          <Text>Deck: {deckCards.length}</Text>
          <button onClick={onOpen}>Open deck</button>
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
    </>
  );
};
