import { useQuery } from '@tanstack/react-query';

export const fetchCodeToSetMap = () =>
  fetch('https://api.pokemontcg.io/v2/sets/').then(res => res.json());

export const useCodeToSetMap = () => {
  const { data: sets, isLoading } = useQuery({
    queryKey: ['code-to-set-map'],
    queryFn: () => fetchCodeToSetMap(),
  });

  return {
    data: sets?.data?.reduce(
      (acc: Record<string, string>, set: Record<string, any>) => {
        if (set.id === 'sv1') {
          return {
            ...acc,
            SVI: 'sv1',
          };
        }

        if (set.id === 'sv2') {
          return {
            ...acc,
            PAL: 'sv2',
          };
        }
  
        // TODO: stupid fix for trainer gallery please actually change this
        if (acc[set.ptcgoCode]) {
          return acc;
        }
  
        return {
          ...acc,
          [set.ptcgoCode]: set.id,
        };
      },
      {}
    ),
    isLoading
  }
};