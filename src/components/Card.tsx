import { Box } from '@chakra-ui/react';
import { MouseEvent, useCallback, useState } from 'react';

export const Card = () => {
  const THRESHOLD = 15;
  const WIDTH = 250;

  const [transform, setTransform] = useState('');
  const [glowBackgroundImage, setGlowBackgroundImage] = useState('');
  const [showBig, setShowBig] = useState(false);

  const handleHover = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { clientWidth, clientHeight, offsetLeft, offsetTop } = currentTarget;

    const horizontal = (clientX - offsetLeft) / clientWidth;
    const vertical = (clientY - offsetTop) / clientHeight;

    const rotateX = (THRESHOLD / 2 - horizontal * THRESHOLD).toFixed(2);
    const rotateY = (vertical * THRESHOLD - THRESHOLD / 2).toFixed(2);

    transformCard(clientWidth, rotateY, rotateX);
    setGlowBackgroundImage(`radial-gradient(
      circle at
      ${horizontal * 2 + clientX / 2}px
      ${vertical * 2 + clientY / 2}px,
      #ffffffff,
      #0000000f
    )
  `);
  }, []);

  const handleClick = useCallback(() => {
    if (!showBig) {
      setTransform(`scale3d(1.55, 1.55, 1.55)`);
    } else {
      setTransform(`scale3d(1, 1, 1)`);
    }

    setShowBig(!showBig);
  }, [showBig, setShowBig]);

  const resetStyles = useCallback((e: MouseEvent<HTMLDivElement>) => {
    setTransform(
      `perspective(${e.currentTarget.clientWidth}px) rotateX(0deg) rotateY(0deg)`
    );
    setShowBig(false);
    setGlowBackgroundImage('');
  }, []);

  const transformCard = useCallback(
    (clientWidth: number, rotateY: string, rotateX: string) => {
      setTransform(
        `perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1.1, 1.1, 1.1)`
      );
    },
    []
  );

  return (
    <Box
      onMouseMove={handleHover}
      onMouseLeave={resetStyles}
      onClick={handleClick}
      transform={transform}
      transitionDuration='300ms'
      transitionTimingFunction='ease-out'
      aria-label='Colress'
      backgroundImage='url(https://images.pokemontcg.io/swsh12pt5gg/GG59_hires.png)'
      backgroundSize='cover'
      height={`${WIDTH * 1.396}px`}
      width={`${WIDTH}px`}
      borderRadius={13}
      _hover={{
        boxShadow: '0 5px 20px 5px #00000044;',
      }}
    >
      <Box
        position={'absolute'}
        width='100%'
        height='100%'
        top={0}
        left={0}
        opacity={0.23}
        backgroundImage={glowBackgroundImage}
        borderRadius={13}
      />
    </Box>
  );
};
