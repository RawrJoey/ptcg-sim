import { Image } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';

const THRESHOLD = 15;

export const Card = () => {
  const [transform, setTransform] = useState('');

  const handleHover = useCallback(e => {
    const { clientX, clientY, currentTarget } = e;
    const { clientWidth, clientHeight, offsetLeft, offsetTop } = currentTarget;

    const horizontal = (clientX - offsetLeft) / clientWidth;
    const vertical = (clientY - offsetTop) / clientHeight;

    const rotateX = (THRESHOLD / 2 - horizontal * THRESHOLD).toFixed(2);
    const rotateY = (vertical * THRESHOLD - THRESHOLD / 2).toFixed(2);

    transformCard(clientWidth, rotateY, rotateX);
  }, []);

  const resetStyles = useCallback(e => {
    setTransform(
      `perspective(${e.currentTarget.clientWidth}px) rotateX(0deg) rotateY(0deg)`
    );
  }, []);

  const transformCard = useCallback(
    (clientWidth: number, rotateY: string, rotateX: string) => {
      setTransform(
        `perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1, 1, 1)`
      );
    },
    []
  );

  return (
    <Image
      onMouseMove={handleHover}
      onMouseLeave={resetStyles}
      transform={transform}
      aria-label='Colress'
      src='https://images.pokemontcg.io/swsh12pt5gg/GG59_hires.png'
      height='300px'
    />
  );
};
