import { CARD_TRANSITION_DURATION } from '@/styles/constants';
import { Box, keyframes } from '@chakra-ui/react';
import { MouseEvent, useCallback, useState } from 'react';
import Draggable from 'react-draggable';
import { CardProps } from './CardProps';
import { getCardDimensions } from './helpers';

export const Card = (props: CardProps) => {
  const THRESHOLD = 15;
  const { height, width } = getCardDimensions(props.size);

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
      setTransform(`translateY(-2rem)`);
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

  const drawKeyframe = keyframes`
    from {transform: translateY(50px);}
    to {transform: translateY(0)}
  `;
  const drawAnimation = `${drawKeyframe} 1 ${
    CARD_TRANSITION_DURATION * 0.75
  }ms ease`;

  return (
    <Draggable>
      <Box height={`${height}px`} width={`${width}px`}>
        <Box
          borderRadius={13}
          cursor='pointer'
          boxShadow={transform ? '0 5px 20px 5px #00000044;' : 'none'}
          _before={{
            content: '" "',
            position: 'absolute',
            width: `${width}px`,
            height: `${height}px`,
            backgroundImage:
              'url(https://images.pokemontcg.io/swsh12pt5gg/GG59_hires.png)',
            backgroundSize: 'cover',
          }}
          onMouseMove={handleHover}
          onMouseLeave={resetStyles}
          onClick={handleClick}
          transform={transform}
          transitionDuration={`${CARD_TRANSITION_DURATION}ms`}
          transitionTimingFunction='ease-out'
          animation={
            props.entranceBehavior === 'draw' ? drawAnimation : undefined
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
      </Box>
    </Draggable>
  );
};
