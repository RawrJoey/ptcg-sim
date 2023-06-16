import { useAppSelector } from "@/app/hooks"
import { useChannelReceiver } from "@/features/game/broadcast/useChannelReceiver";
import { useChannelSender } from "@/features/game/broadcast/useChannelSender";
import { useGameController } from "@/features/game/useGameController";
import { useInterfaceController } from "@/features/interface/useInterfaceController";
import { Stack } from "@chakra-ui/react";
import { Board } from "./Board/Board";
import { HelperBubble } from "./Game/HelperBubble";
import { FriendList } from "./Lobby/Friends/FriendList";
import { Login } from "./Login";

export const PageController = () => {
  const currentScreen = useAppSelector((state) => state.interface.screen);

  useInterfaceController();
  useGameController();
  useChannelReceiver();
  useChannelSender();

  if (currentScreen === 'lobby') {
    return (
      <Stack
        height='100%'
        justifyContent={'center'}
        align='center'
        maxWidth={'100%'}
      >
        <Login />
        <FriendList />
      </Stack>
    )
  }

  if (currentScreen === 'in-game') {
    return (
      <Stack
        height='100%'
        justifyContent={'center'}
        align='center'
        maxWidth={'100%'}
      >
        <Login />
        <HelperBubble />
        <Board />
      </Stack>
    )
  }

  return null;
}