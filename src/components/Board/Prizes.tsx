import { useAppDispatch } from '@/app/hooks';
import { takePrize } from '@/features/game/gameSlice';
import { Box, Grid, HStack } from '@chakra-ui/react';
import { DraggableCard } from '../Card/DraggableCard';
import { useDeck } from './useDeck';

export const Prizes = () => {
  const prizes = useDeck().prizes;
  const dispatch = useAppDispatch();

  return (
    <Grid gridTemplateColumns='5rem auto'>
      {prizes.map((prizeCard, idx) => (
        <Box key={prizeCard.uuid} onClick={() => dispatch(takePrize(idx))}>
          <DraggableCard
            cardOrigin={{ area: 'prizes' }}
            card={prizeCard}
            size='sm'
            hoverBehavior='float'
            isHidden
          />
        </Box>
      ))}
    </Grid>
  );
};
