import { CardSize } from './CardProps';

export const getCardDimensions = (size?: CardSize) => {
  const width = size === 'lg' ? 250 : size === 'md' ? 150 : 100;
  const height = width * 1.396;

  return {
    height,
    width,
  };
};
