import { useAppSelector } from "@/app/hooks"
import { DraggableCard } from "../Card/DraggableCard";
import { DropZone } from "../Generic/DropZone"
import { Pokemon } from "./Pokemon";

export const ActivePokemon = () => {
  const active = useAppSelector((state) => state.game.myDeck.activePokemon);

  return <DropZone zone="active">
    {active && <Pokemon card={active} isActive />}
  </DropZone>
}