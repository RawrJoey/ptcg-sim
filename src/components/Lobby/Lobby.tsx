import { useGameStartedListener } from "@/features/game/broadcast/useGameStartedListener"
import { Stack } from "@chakra-ui/react";
import { Login } from "../Login";
import { FriendList } from "./Friends/FriendList";

export const Lobby = () => {
  useGameStartedListener();

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