import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { takePrize } from '@/features/game/gameSlice';
import { Box, Grid, HStack } from '@chakra-ui/react';
import { DraggableCard } from '../Card/DraggableCard';

export const Prizes = () => {
  const prizes = useAppSelector(state => state.game.myDeck.prizes);
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
