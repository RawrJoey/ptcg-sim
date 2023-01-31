import { Board } from '@/components/Board/Board';
import { Hand } from '@/components/Hand';
import { CARD_TRANSITION_DURATION } from '@/styles/constants';
import { Button, Stack } from '@chakra-ui/react';
import { useState } from 'react';

export default function Cards() {
  return (
    <Stack
      height='100%'
      justifyContent={'center'}
      align='center'
      maxWidth={'100%'}
    >
      <Board />
    </Stack>
  );
}
