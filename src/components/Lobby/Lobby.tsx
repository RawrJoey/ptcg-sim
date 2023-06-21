import { useGameStartedListener } from "@/features/game/broadcast/useGameStartedListener"
import { Stack } from "@chakra-ui/react";
import { Login } from "../Login";
import { FinishSetupModal } from "./FinishSetupModal";
import { FriendList } from "./Friends/FriendList";
import { useCurrentProfile } from "./useCurrentProfile";

export const Lobby = () => {
  const profile = useCurrentProfile();
  useGameStartedListener();

  return (
    <Stack
      height='100%'
      justifyContent={'center'}
      align='center'
      maxWidth={'100%'}
    >
      <FinishSetupModal />
      <Login />
      {profile.data?.username && <FriendList />}
    </Stack>
  )
}