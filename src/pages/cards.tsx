import { Board } from '@/components/Board/Board';
import { Login } from '@/components/Login';
import { useGameController } from '@/features/game/useGameController';
import { Button, Stack } from '@chakra-ui/react';

export default function Cards() {
  useGameController();

  return (
    <Stack
      height='100%'
      justifyContent={'center'}
      align='center'
      maxWidth={'100%'}
    >
      <Login />
      <Board />
    </Stack>
  );
}
