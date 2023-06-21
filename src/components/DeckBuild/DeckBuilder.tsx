import { useState } from 'react';
import { Box, Grid, Heading, HStack, Image, Input, Stack, Text, useToast } from "@chakra-ui/react"
import { useCardsAutoComplete } from './useCardsAutoComplete';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { Subtype, Supertype } from 'pokemon-tcg-sdk-typescript/dist/sdk';

// function debounce( callback: () => void, delay: number ) {
//   let timeout: any;
//   return function() {
//       clearTimeout( timeout );
//       timeout = setTimeout( callback, delay );
//   }
// }

export const DeckBuilder = () => {
  const [cardSearch, setCardSearch] = useState('');
  const { data: searchedCards } = useCardsAutoComplete(cardSearch);
  const [cards, setCards] = useState<Record<string, { count: number, card: PokemonTCG.Card }>>({});
  const toast = useToast();
  console.log(searchedCards)

  const getTrueCardCount = (card: PokemonTCG.Card) => {
    return Object.values(cards).reduce((acc: number, curr) => {
      if (curr.card.name === card.name) return acc + curr.count;
      return acc;
    }, 0);
  }

  const handleAddCard = (card: PokemonTCG.Card) => {
    if (getTrueCardCount(card) >= 4 && !(card.supertype === Supertype.Energy && card.subtypes.includes(Subtype.Basic))) {
      return toast({
        status: 'error',
        title: 'Only 4 per card!'
      })
    }

    if (cards[card.id]) {
      setCards({
        ...cards,
        [card.id]: {
          ...cards[card.id],
          count: cards[card.id].count + 1
        }
      });
    } else {
      setCards({
        ...cards,
        [card.id]: {
          card,
          count: 1
        }
      });
    }
  };

  const handleRemoveCard = (card: PokemonTCG.Card) => {
    const newCards = { ...cards };

    if (newCards[card.id].count === 1) {
      delete newCards[card.id];
    } else {
      newCards[card.id].count -= 1;
    }
    console.log(cards, newCards)

    setCards(newCards)
  }

  return (
    <Grid gridTemplateColumns={'1fr 1fr'} columnGap={8}>
      <Stack>
        <Input placeholder="Search" onChange={e => setCardSearch(e.target.value)} />
        <Grid gridTemplateColumns={'1fr 1fr'}>
          {searchedCards?.slice().reverse()?.map((card) => (
            <Box key={card.id} cursor='pointer' onClick={() => handleAddCard(card)}>
              <Image src={card.images.small} />
            </Box>
          ))}
        </Grid>
      </Stack>
      <Stack>
        <Heading size='md'>My deck</Heading>
        <Grid gridTemplateColumns={'1fr 1fr 1fr'}>
          {Object.values(cards).map(({ count, card }) => (
            <Stack key={card.id} cursor='pointer' onClick={() => handleRemoveCard(card)}>
              <Image src={card.images.small} />
              <Text>{count}</Text>
            </Stack>
          ))}
        </Grid>
      </Stack>
    </Grid>
  )
}