import { useQuery } from "@tanstack/react-query";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

export const fetchCardsAutoComplete = async (name: string) => {
  if (name.length === 0) return [];

  const cards = await PokemonTCG.findCardsByQueries({
    q: `name:"${name}"`
  });
  return cards;
}

export const useCardsAutoComplete = (name: string) => {
  return useQuery({
    queryKey: ['cards', name],
    queryFn: () => fetchCardsAutoComplete(name)
  });
};