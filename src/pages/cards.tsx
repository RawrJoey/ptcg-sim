import { Board } from '@/components/Board/Board';
import { Login } from '@/components/Login';
import { Button, Stack } from '@chakra-ui/react';

export default function Cards() {
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
