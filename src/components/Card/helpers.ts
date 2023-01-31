export const getCardDimensions = (size?: 'sm' | 'md') => {
  const width = size === 'md' ? 250 : 150;
  const height = width * 1.396;

  return {
    height,
    width,
  };
};
