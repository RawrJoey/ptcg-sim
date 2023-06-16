import { useAppSelector } from "@/app/hooks"
import { useInterfaceController } from "@/features/interface/useInterfaceController";
import { Stack } from "@chakra-ui/react";
import { GameController } from "./Game/GameController";
import { FriendList } from "./Lobby/Friends/FriendList";
import { Lobby } from "./Lobby/Lobby";
import { Login } from "./Login";

export const PageController = () => {
  const currentScreen = useAppSelector((state) => state.interface.screen);

  useInterfaceController();

  if (currentScreen === 'lobby') {
    return <Lobby />
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
        <GameController />
      </Stack>
    )
  }

  return null;
}