import { Board } from '@/components/Board/Board';
import { HelperBubble } from '@/components/Game/HelperBubble';
import { FriendList } from '@/components/Lobby/Friends/FriendList';
import { Login } from '@/components/Login';
import { useChannelReceiver } from '@/features/game/broadcast/useChannelReceiver';
import { useChannelSender } from '@/features/game/broadcast/useChannelSender';
import { useGameController } from '@/features/game/useGameController';
import { Button, Stack } from '@chakra-ui/react';

export default function Cards() {
  useGameController();
  useChannelReceiver();
  useChannelSender();

  return (
    <Stack
      height='100%'
      justifyContent={'center'}
      align='center'
      maxWidth={'100%'}
    >
      <Login />
      <FriendList />
      {/* <HelperBubble />
      <Board /> */}
    </Stack>
  );
}
