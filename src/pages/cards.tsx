import { Hand } from '@/components/Hand';
import { CARD_TRANSITION_DURATION } from '@/styles/constants';
import { Button, Stack } from '@chakra-ui/react';
import { useState } from 'react';

export default function Cards() {
  const [handCards, setHandCards] = useState(['colress', 'colress', 'colress']);

  return (
    <Stack
      height='100%'
      justifyContent={'center'}
      align='center'
      maxWidth={'100%'}
    >
      <Stack transitionDuration={`${CARD_TRANSITION_DURATION}ms`} width='100%'>
        <Hand cards={handCards} />
        <Button onClick={() => setHandCards([...handCards, 'colress'])}>
          Draw
        </Button>
      </Stack>
    </Stack>
  );
}
