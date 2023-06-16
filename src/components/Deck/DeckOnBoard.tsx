import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { drawCard } from '@/features/game/gameSlice';
import { Box, Text } from '@chakra-ui/react';
import { useDeck } from '../Board/useDeck';
import { BlankCard } from '../Card/BlankCard';

export const DeckOnBoard = () => {
  const deckCards = useDeck().deckCards;
  const dispatch = useAppDispatch();
  const isYourTurn = useAppSelector((state) => state.game.phase.type === 'your-turn');

  return (
    <Box cursor={isYourTurn ? 'pointer' : 'auto'} onClick={() => isYourTurn && dispatch(drawCard())}>
      <Text>Deck: {deckCards.length}</Text>
      <BlankCard />
    </Box>
  );
};
