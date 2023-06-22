import { useDecks } from "@/features/decks/useDecks";
import { acceptChallenge, sendChallenge } from "@/features/social/challenges/mutators";
import { useActiveChallenges } from "@/features/social/challenges/useActiveChallenges";
import { FriendType } from "@/features/social/useFriends"
import { Avatar, AvatarBadge, Button, HStack, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { ChallengeFriendModal } from "./ChallengeFriendModal";

interface FriendProps {
  friend: FriendType;
  isOnline?: boolean;
}

export const Friend = (props: FriendProps) => {
  // Used for the second you press challenge, want it to be disabled
  const [tempDisable, setTempDisable] = useState(false);

  const supabase = useSupabaseClient();
  const user = useUser();
  const { data: activeFriendChallenges, refetch } = useActiveChallenges(props.friend.id);
  const alreadyChallenged = tempDisable || activeFriendChallenges?.some((friendOfFriend) => friendOfFriend.challenger === user?.id);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAcceptingOpen, onOpen: onAcceptingOpen, onClose: onAcceptingClose } = useDisclosure();
  const toast = useToast();

  const handleAcceptChallenge = async (deckId: string) => {
    if (!props.friend.challengeId) return;

    await acceptChallenge(supabase, props.friend.challengeId, deckId);
    refetch();
  }

  const handleSendChallenge = (deckId: string) => {
    setTempDisable(true);
    user && sendChallenge(supabase, user.id, props.friend.id, deckId);
    onClose();
    toast({
      title: 'Challenge sent'
    })
  }

  if (!user) return <Text>{'Loading...'}</Text>;

  return (
    <HStack spacing={4}>
      <ChallengeFriendModal isOpen={isOpen} onClose={onClose} onConfirm={handleSendChallenge} friend={props.friend} />
      <ChallengeFriendModal isOpen={isAcceptingOpen} onClose={onAcceptingClose} onConfirm={handleAcceptChallenge} friend={props.friend} isAcceptingChallenge />
      <Avatar>
        <AvatarBadge borderColor='papayawhip' bg={props.isOnline ? 'green.500' : 'tomato'} boxSize='1.25em' />
      </Avatar>
      <Text>{props.friend.username}</Text>
      {!props.friend.challengeId && (
        <Button isDisabled={alreadyChallenged} onClick={onOpen}>{alreadyChallenged ? 'Waiting...' : 'Challenge'}</Button>
      )
      }
      {props.friend.challengeId && (
        <Button colorScheme='red' onClick={onAcceptingOpen}>
          Accept challenge
        </Button>
      )}
    </HStack>
  )
}