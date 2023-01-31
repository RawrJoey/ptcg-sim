import { CARD_TRANSITION_DURATION } from '@/styles/constants';
import { Box, keyframes } from '@chakra-ui/react';
import { MouseEvent, useCallback, useState } from 'react';

interface CardProps {
  size: 'sm' | 'md';
  hoverBehavior: 'bevel' | 'float';
  entranceBehavior?: 'draw';
  clickToZoom?: boolean;
}

export const Card = (props: CardProps) => {
  const THRESHOLD = 15;
  const WIDTH = props.size === 'md' ? 250 : 150;

  const [transform, setTransform] = useState('');
  const [glowBackgroundImage, setGlowBackgroundImage] = useState('');
  const [showBig, setShowBig] = useState(false);

  const handleHover = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { clientWidth, clientHeight, offsetLeft, offsetTop } = currentTarget;

    const horizontal = (clientX - offsetLeft) / clientWidth;
    const vertical = (clientY - offsetTop) / clientHeight;

    if (props.hoverBehavior === 'bevel') {
      const rotateX = (THRESHOLD / 2 - horizontal * THRESHOLD).toFixed(2);
      const rotateY = (vertical * THRESHOLD - THRESHOLD / 2).toFixed(2);

      setTransform(
        `perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1.1, 1.1, 1.1)`
      );
      setGlowBackgroundImage(`radial-gradient(
        circle at
        ${horizontal * 2 + clientX / 2}px
        ${vertical * 2 + clientY / 2}px,
        #ffffffff,
        #0000000f
      )
    `);
    } else if (props.hoverBehavior === 'float') {
      setTransform(`translateY(-1.5rem)`);
    }
  }, []);

  const handleClick = useCallback(() => {
    if (props.clickToZoom) {
      if (!showBig) {
        setTransform(`scale3d(1.55, 1.55, 1.55)`);
      } else {
        setTransform(`scale3d(1, 1, 1)`);
      }

      setShowBig(!showBig);
    }
  }, [props.clickToZoom, showBig, setShowBig]);

  const resetStyles = useCallback((e: MouseEvent<HTMLDivElement>) => {
    setTransform('');
    setShowBig(false);
    setGlowBackgroundImage('');
  }, []);

  const drawAnimation = keyframes`
    from {transform: translateY(50px);}
    to {transform: translateY(0)}
  `;

  return (
    <Box
      onMouseMove={handleHover}
      onMouseLeave={resetStyles}
      onClick={handleClick}
      transform={transform}
      transitionDuration={`${CARD_TRANSITION_DURATION}ms`}
      transitionTimingFunction='ease-out'
      aria-label='Colress'
      backgroundImage='url(https://images.pokemontcg.io/swsh12pt5gg/GG59_hires.png)'
      backgroundSize='cover'
      height={`${WIDTH * 1.396}px`}
      width={`${WIDTH}px`}
      borderRadius={13}
      boxShadow={transform ? '0 5px 20px 5px #00000044;' : 'none'}
      animation={
        props.entranceBehavior === 'draw'
          ? `${drawAnimation} 1 ${CARD_TRANSITION_DURATION * 0.75}ms ease`
          : undefined
      }
    >
      {glowBackgroundImage && (
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
      )}
    </Box>
  );
};
