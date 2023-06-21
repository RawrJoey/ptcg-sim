import { useActiveFriendsController } from "@/features/social/useActiveFriendsController";
import { useFriends } from "@/features/social/useFriends"
import { Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { AddFriend } from "./AddFriend";
import { Friend } from "./Friend";
import { FriendRequestList } from "./FriendRequestList";

export const FriendList = () => {
  const { data: friends } = useFriends();
  const activeFriends = useActiveFriendsController();

  return (
    <Stack>
      <HStack>
        <Heading>Friends</Heading>
        <AddFriend />
      </HStack>
      {friends?.map((friend) => (
        <Friend key={friend.id} friend={friend} isOnline={activeFriends?.[friend.id] === true} />
      ))}
      <FriendRequestList />
    </Stack>
  )
}