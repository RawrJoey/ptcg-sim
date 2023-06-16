import { useDeck } from "../Board/useDeck";
import { DropZone } from "../Generic/DropZone"
import { Pokemon } from "./Pokemon";

export const ActivePokemon = () => {
  const active = useDeck().activePokemon;

  return <DropZone zone={{ area: 'active' }}>
    {active && <Pokemon card={active} isActive />}
  </DropZone>
}