import { FriendType } from "@/features/social/useFriends"
import { Avatar, AvatarBadge, HStack, Text } from "@chakra-ui/react";

interface FriendProps {
  friend: FriendType;
}

export const Friend = (props: FriendProps) => {
  return (
    <HStack spacing={4}>
      {/* <Avatar>
        <AvatarBadge borderColor='papayawhip' bg={props.friend.onlineStatus ? 'green.500' : 'tomato'} boxSize='1.25em' />
      </Avatar> */}
      <Text>{props.friend.name}</Text>
    </HStack>
  )
}