import { useState } from 'react';
import { useDecks } from "@/features/decks/useDecks";
import { FriendType } from "@/features/social/useFriends";
import { Button, Heading, HStack, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text } from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";

interface ChallengeFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  sendChallenge: (deckId: string) => void;
  friend: FriendType;
}

export const ChallengeFriendModal = (props: ChallengeFriendModalProps) => {
  const user = useUser();
  const { data: myDecks } = useDecks(user?.id);
  const [selectedDeck, setSelectedDeck] = useState<string | undefined>()

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Challenge {props.friend.username}</ModalHeader>
        <ModalBody>
        <Stack>
          <Text>Select deck to challenge with</Text>
          <HStack>{myDecks?.map((deck) => <Button key={'challenge-deck' + deck.id} colorScheme={selectedDeck === deck.id ? 'blue' : 'gray'} onClick={() => setSelectedDeck(deck.id)}>{deck.name}</Button>)}</HStack>
        </Stack>
        </ModalBody>
        <ModalFooter>
          <Button isDisabled={!selectedDeck} colorScheme='red' onClick={() => selectedDeck && props.sendChallenge(selectedDeck)}>
            Challenge
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}