import { sendChallenge } from "@/features/social/challenges/mutators";
import { useChallenges } from "@/features/social/challenges/useChallenges";
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
  const { data: friendChallenges } = useChallenges(props.friend.id);
  const alreadyChallenged = tempDisable || friendChallenges?.some((friendOfFriend) => friendOfFriend.challenger === user?.id);

  if (!user) return <Text>{'Loading...'}</Text>;

  return (
    <HStack spacing={4}>
      {/* <Avatar>
        <AvatarBadge borderColor='papayawhip' bg={props.friend.onlineStatus ? 'green.500' : 'tomato'} boxSize='1.25em' />
      </Avatar> */}
      <Text>{props.friend.name}</Text>
      <Button isDisabled={alreadyChallenged} onClick={() => {
        setTempDisable(true);
        sendChallenge(supabase, user.id, props.friend.id);
      }}>{alreadyChallenged ? 'Waiting...' : 'Challenge'}</Button>
    </HStack>
  )
}