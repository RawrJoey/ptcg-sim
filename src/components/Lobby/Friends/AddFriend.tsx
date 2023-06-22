import { useState } from 'react';
import { Button, Input, Modal, ModalContent, ModalFooter, ModalHeader, ModalBody, ModalOverlay, useDisclosure, useToast } from "@chakra-ui/react"
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useFriends } from '@/features/social/useFriends';

export const AddFriend = () => {
  const { data: friends } = useFriends();
  const user = useUser();
  const [username, setUsername] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const supabase = useSupabaseClient();
  const toast = useToast();

  const handleSendFriendRequestClick = async () => {
    if (friends?.some((friend) => friend.username === username)) {
      return toast({
        status: 'error',
        title: 'You are already friends with ' + username + '!',
      })
    }

    const res = await supabase.from('Profiles').select('id').eq('username', username).single();

    if (!res.data) {
      return toast({
        status: 'error',
        title: 'No user with username ' + username + '.'
      })
    }

    const checkMadeRequestRes = await supabase.from('Friend Requests').select('id').eq('to', username).eq('from', user?.id);

    if (checkMadeRequestRes.data) {
      return toast({
        status: 'error',
        title: 'You already sent a request to this user!',
      })
    }

    const insertRes = await supabase.from('Friend Requests').insert({ to: username, from: user?.id });

    if (insertRes.error) {
      return toast({
        status: 'error',
        title: 'Error sending request.',
        description: insertRes.error.message
      })
    }

    onClose();
    setUsername('');
    toast({
      status: 'success',
      title: 'Friend request sent!'
    });
  }

  return (
    <>
      <Button onClick={onOpen}>Add friend</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add by username</ModalHeader>
          <ModalBody>
            <Input placeholder="Enter username" onChange={e => setUsername(e.target.value)} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSendFriendRequestClick}>Send friend request</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}