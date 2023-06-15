import { useAppDispatch } from '@/app/hooks';
import { drawCard } from '@/features/deck/gameSlice';
import { Box } from '@chakra-ui/react';
import { BlankCard } from '../Card/BlankCard';

export const DeckOnBoard = () => {
  const dispatch = useAppDispatch();

  return (
    <Box cursor='pointer' onClick={() => dispatch(drawCard())}>
      <BlankCard />
    </Box>
  );
};
