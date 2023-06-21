import { useCurrentProfile } from "@/features/social/useCurrentProfile";
import { useMyFriendRequests } from "@/features/social/useMyFriendRequests"
import { Button, Heading, HStack, Stack, Text, useToast } from "@chakra-ui/react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

export const FriendRequestList = () => {
  const { data: profile } = useCurrentProfile();
  const { data: friendRequests, refetch } = useMyFriendRequests();
  const supabase = useSupabaseClient();
  const toast = useToast();

  const handleAcceptFriendRequest = async (fromId: string) => {
    const updateRes = await supabase.from('Friend Requests').update({ accepted: true }).eq('to', profile?.username).eq('from', fromId);

    if (updateRes.error) {
      return toast({
        status: 'error',
        title: 'Error accepting friend request',
        description: updateRes.error.message
      })
    }

    const firstAddFriendRes = await supabase.from('Friends').insert({user: fromId, friend: profile?.id });

    if (firstAddFriendRes.error) {
      return toast({
        status: 'error',
        title: 'Error adding friend',
        description: firstAddFriendRes.error.message
      })
    }
    
    const secondAddFriendRes = await supabase.from('Friends').insert({ user: profile?.id, friend: fromId });

    if (secondAddFriendRes.error) {
      return toast({
        status: 'error',
        title: 'Error adding friend',
        description: secondAddFriendRes.error.message
      })
    }

    await refetch();
    toast({
      status: 'success',
      title: 'Friend added!',
    })
  }

  return (friendRequests && friendRequests?.length > 0) ? (
    <Stack>
      <Heading size='md'>Friend requests</Heading>
      {friendRequests?.map((friendRequest) => (
        <HStack key={friendRequest.id + 'frq'}>
          <Text>{friendRequest.username}</Text>
          <Button colorScheme={'green'} onClick={() => handleAcceptFriendRequest(friendRequest.id)}>Accept</Button>
        </HStack>
      ))}
    </Stack>
  ) : null;
}