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
    <Stack height='100%' paddingY={8} paddingX={16}>
      <FinishSetupModal />
      {profile.data?.username && <FriendList />}
    </Stack>
  )
}