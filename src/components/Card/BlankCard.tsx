import { Image } from '@chakra-ui/react';
import { getCardDimensions } from './helpers';

export const BlankCard = () => {
  const { height, width } = getCardDimensions();

  return (
    <Image
      height={height}
      width={width}
      aria-label='blank card'
      src='https://images.pokemontcg.io/0.png'
    />
  );
};
