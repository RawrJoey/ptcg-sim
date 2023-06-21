import { useState } from 'react';
import { Button, Input, Modal, ModalContent, ModalFooter, ModalHeader, ModalBody, ModalOverlay, useDisclosure, useToast } from "@chakra-ui/react"
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

export const AddFriend = () => {
  const user = useUser();
  const [username, setUsername] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const supabase = useSupabaseClient();
  const toast = useToast();

  const handleSendFriendRequestClick = async () => {
    const res = await supabase.from('Profiles').select('id').eq('username', username).single();

    if (!res.data) {
      return toast({
        status: 'error',
        title: 'No user with username ' + username + '.'
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