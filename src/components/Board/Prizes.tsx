import { useAppSelector } from "@/app/hooks"
import { Grid } from "@chakra-ui/react";
import { DraggableCard } from "../Card/DraggableCard";

export const Prizes = () => {
  const prizes = useAppSelector((state) => state.game.myDeck.prizes);

  return (
    <Grid gridTemplateColumns='9rem 9rem' gridTemplateRows='1fr 1fr 1fr'>
      {prizes.map((prizeCard) => <DraggableCard key={prizeCard.uuid} cardOrigin={{ area: 'prizes' }} card={prizeCard} size='md' hoverBehavior='float' isHidden />)}
    </Grid>
  )
}