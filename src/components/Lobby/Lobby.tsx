import { useGameStartedListener } from "@/features/game/broadcast/useGameStartedListener"
import { Container, Stack } from "@chakra-ui/react";
import { Login } from "../Login";
import { FinishSetupModal } from "./FinishSetupModal";
import { FriendList } from "./Friends/FriendList";
import { useCurrentProfile } from "../../features/social/useCurrentProfile";

export const Lobby = () => {
  const profile = useCurrentProfile();
  useGameStartedListener();

  return (
    <Container
      height='100%'
      alignItems='center'
      size='md'
    >
      <Stack height='100%'>
        <FinishSetupModal />
        {profile.data?.username && <FriendList />}
      </Stack>
    </Container>
  )
}