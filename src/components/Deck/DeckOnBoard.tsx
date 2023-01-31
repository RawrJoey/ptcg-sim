import { Box } from '@chakra-ui/react';
import { BlankCard } from '../Card/BlankCard';

interface DeckOnBoardProps {
  drawCard: () => void;
}

export const DeckOnBoard = (props: DeckOnBoardProps) => {
  return (
    <Box cursor='pointer' onClick={props.drawCard}>
      <BlankCard />
    </Box>
  );
};
