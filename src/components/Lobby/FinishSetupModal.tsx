import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useProfile } from "./useProfile";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useDisclosure, useToast } from "@chakra-ui/react";

export const FinishSetupModal = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const { data: profile, isLoading, refetch } = useProfile(user?.id ?? '');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');

  const toast = useToast();

  useEffect(() => {
    if (!isLoading && !profile?.username) {
      onOpen();
    }
  }, [profile, isLoading]);

  const handleSubmit = async () => {
    // TODO: checking of username and name
    const res = await supabase.from('Profiles').select('id').eq('username', username).single();

    // TODO: error that username is already found
    if (res.data) return;

    const insertRes = await supabase.from('Profiles').insert({
      id: user?.id,
      name,
      username
    });

    if (insertRes.error) {
      return toast({
        status: 'error',
        title: 'Error creating account :(',
        description: insertRes.error.message
      })
    };

    onClose();
    toast({
      status: 'success',
      title: 'Account setup successfully!'
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Finish setup</ModalHeader>
        <ModalBody>
          <Stack>
            <Input placeholder='Choose a username' onChange={e => setUsername(e.target.value)} />
            <Input placeholder='What is your full name?' onChange={e => setName(e.target.value)} />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSubmit} isDisabled={name.length === 0 || username.length === 0}>Submit</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}