import { useFriends } from "@/features/social/useFriends"
import { Heading, Stack, Text } from "@chakra-ui/react";
import { Friend } from "./Friend";

export const FriendList = () => {
  const { data: friends } = useFriends();

  return (
    <Stack>
      <Heading>Friends</Heading>
      {friends?.map((friend) => (
        <Friend key={friend.id} friend={friend} />
      ))}
    </Stack>
  )
}