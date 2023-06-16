import { useAppSelector } from "@/app/hooks"
import { Grid, HStack } from "@chakra-ui/react";
import { DraggableCard } from "../Card/DraggableCard";

export const Prizes = () => {
  const prizes = useAppSelector((state) => state.game.myDeck.prizes);

  return (
    <Grid gridTemplateColumns='5rem auto'>
      {prizes.map((prizeCard) => <DraggableCard key={prizeCard.uuid} cardOrigin={{ area: 'prizes' }} card={prizeCard} size='sm' hoverBehavior='float' isHidden />)}
    </Grid>
  )
}