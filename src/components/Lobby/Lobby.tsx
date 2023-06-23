import { useGameStartedListener } from "@/features/game/broadcast/useGameStartedListener"
import { Container, HStack, Stack } from "@chakra-ui/react";
import { Login } from "../Login";
import { FinishSetupModal } from "./FinishSetupModal";
import { FriendList } from "./Friends/FriendList";
import { useCurrentProfile } from "../../features/social/useCurrentProfile";
import { DeckBuilderOpenButton } from "../DeckBuild/DeckBuilderOpenButton";
import { ListOfMyDecks } from "../DeckBuild/ListOfMyDecks";
import { useUser } from "@supabase/auth-helpers-react";
import { SplashPage } from "../SplashPage";
import { DeckImportButton } from "../DeckBuild/DeckImport/DeckImportButton";

export const Lobby = () => {
  const user = useUser();
  const profile = useCurrentProfile();
  useGameStartedListener();

  if (!user?.id) {
    return <SplashPage />
  }

  return (
    <Stack height='100%' paddingY={8} paddingX={16}>
      <FinishSetupModal />
      
      {profile.data?.username && (
        <Stack>
          <FriendList />
          <ListOfMyDecks />
          <HStack>
            <DeckBuilderOpenButton />
            <DeckImportButton  />
          </HStack>
        </Stack>
      )}
    </Stack>
  )
}