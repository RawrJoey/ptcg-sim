import { acceptChallenge, sendChallenge } from "@/features/social/challenges/mutators";
import { useActiveChallenges } from "@/features/social/challenges/useActiveChallenges";
import { FriendType } from "@/features/social/useFriends"
import { Avatar, AvatarBadge, Button, HStack, Text } from "@chakra-ui/react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";

interface FriendProps {
  friend: FriendType;
}

export const Friend = (props: FriendProps) => {
  // Used for the second you press challenge, want it to be disabled
  const [tempDisable, setTempDisable] = useState(false);

  const supabase = useSupabaseClient();
  const user = useUser();
  const { data: activeFriendChallenges, refetch } = useActiveChallenges(props.friend.id);
  const alreadyChallenged = tempDisable || activeFriendChallenges?.some((friendOfFriend) => friendOfFriend.challenger === user?.id);

  const handleAcceptChallenge = async () => {
    if (!props.friend.challengeId) return;

    await acceptChallenge(supabase, props.friend.challengeId);
    refetch();
  }

  if (!user) return <Text>{'Loading...'}</Text>;

  return (
    <HStack spacing={4}>
      {/* <Avatar>
        <AvatarBadge borderColor='papayawhip' bg={props.friend.onlineStatus ? 'green.500' : 'tomato'} boxSize='1.25em' />
      </Avatar> */}
      <Text>{props.friend.name}</Text>
      {!props.friend.challengeId && (
        <Button isDisabled={alreadyChallenged} onClick={() => {
          setTempDisable(true);
          sendChallenge(supabase, user.id, props.friend.id);
        }}>{alreadyChallenged ? 'Waiting...' : 'Challenge'}</Button>
      )
      }
      {props.friend.challengeId && (
        <Button colorScheme='red' onClick={handleAcceptChallenge}>
          Accept challenge
        </Button>
      )}
    </HStack>
  )
}