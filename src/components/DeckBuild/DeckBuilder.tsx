import { useState } from 'react';
import { Box, Grid, Heading, HStack, IconButton, Image, Input, Stack, Text, useToast } from "@chakra-ui/react"
import { useCardsAutoComplete } from './useCardsAutoComplete';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { Subtype, Supertype } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { BatchOfCards, CardWithImage } from './DeckBuilderModal';
import { getDeckLength, getTrueCardCount } from './helpers';
import { SavedDeck } from '@/features/decks/useDecks';

// function debounce( callback: () => void, delay: number ) {
//   let timeout: any;
//   return function() {
//       clearTimeout( timeout );
//       timeout = setTimeout( callback, delay );
//   }
// }

const getCardSortScore = (card: PokemonTCG.Card) => {
  if (card.supertype === Supertype.Pokemon) return 1;
  if (card.supertype === Supertype.Trainer && card.subtypes.includes(Subtype.Supporter)) return 2;
  if (card.supertype === Supertype.Trainer && card.subtypes.includes(Subtype.Item)) return 3;
  if (card.supertype === Supertype.Trainer && card.subtypes.includes(Subtype.PokemonTool)) return 4;
  if (card.supertype === Supertype.Trainer && card.subtypes.includes(Subtype.Stadium)) return 5;
  if (card.supertype === Supertype.Energy && card.subtypes.includes(Subtype.Basic)) return 6;
  if (card.supertype === Supertype.Energy && card.subtypes.includes(Subtype.Special)) return 7;
  return 8;
}

interface DeckBuilderProps {
  cards: BatchOfCards;
  setCards: (cards: BatchOfCards) => void;
  deckName: string;
  setDeckName: (name: string) => void;
}

export const DeckBuilder = (props: DeckBuilderProps) => {
  const [cardSearch, setCardSearch] = useState('');
  const { data: searchedCards } = useCardsAutoComplete(cardSearch);
  const toast = useToast();

  const sortMyDeck = (a: { count: number, card: PokemonTCG.Card }, b: { count: number, card: PokemonTCG.Card }) => {
    const aScore = getCardSortScore(a.card);
    const bScore = getCardSortScore(b.card);

    if (aScore === bScore) {
      if (a.count === b.count) {
        if (a.card.name < b.card.name) return -1;
        if (b.card.name < a.card.name) return 1;
        return 0;
      }
      return b.count - a.count;
    }

    return aScore - bScore;
  }

  const handleAddCard = (card: PokemonTCG.Card) => {
    if (getTrueCardCount(props.cards, card) >= 4 && !(card.supertype === Supertype.Energy && card.subtypes.includes(Subtype.Basic))) {
      return toast({
        status: 'error',
        title: 'Only 4 per card!'
      })
    }

    if (props.cards[card.id]) {
      props.setCards({
        ...props.cards,
        [card.id]: {
          ...props.cards[card.id],
          count: props.cards[card.id].count + 1
        }
      });
    } else {
      props.setCards({
        ...props.cards,
        [card.id]: {
          card,
          count: 1
        }
      });
    }
  };

  const handleRemoveCard = (card: PokemonTCG.Card) => {
    const newCards = { ...props.cards };

    if (newCards[card.id].count === 1) {
      delete newCards[card.id];
    } else {
      newCards[card.id].count -= 1;
    }

    props.setCards(newCards)
  }

  return (
    <Grid gridTemplateColumns={'1fr 1fr'} columnGap={8}>
      <Stack>
        <Input placeholder="Search" onChange={e => setCardSearch(e.target.value)} />
        <Grid gridTemplateColumns={'1fr 1fr'} overflowY='scroll' maxHeight='70vh'>
          {searchedCards?.slice().reverse()?.map((card) => (
            <Box key={card.id} cursor='pointer' onClick={() => handleAddCard(card)}>
              <Image src={card.images.small} />
            </Box>
          ))}
        </Grid>
      </Stack>
      <Stack>
        <Grid gridTemplateColumns={'1fr 0.2fr'} alignItems='center' columnGap={2}>
          <Input value={props.deckName} onChange={(e) => props.setDeckName(e.target.value)} placeholder='Enter deck name' />
          <Heading size='md'>({getDeckLength(props.cards)})</Heading>
        </Grid>
        <Grid gridTemplateColumns={'1fr 1fr 1fr'}>
          {Object.values(props.cards).sort(sortMyDeck).map(({ count, card }) => (
            <Stack key={card.id}>
              <Image src={card.images.small} />
              <HStack>
                <Text>{count}</Text>
                <IconButton size='xs' icon={<MinusIcon />} aria-label='Remove card' onClick={() => handleRemoveCard(card)} />
                <IconButton size='xs' icon={<AddIcon />} aria-label='Add card' onClick={() => handleAddCard(card)} />
              </HStack>
            </Stack>
          ))}
        </Grid>
      </Stack>
    </Grid>
  )
}