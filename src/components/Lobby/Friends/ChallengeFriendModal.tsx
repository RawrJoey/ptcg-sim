import { useState } from 'react';
import { useDecks } from "@/features/decks/useDecks";
import { FriendType } from "@/features/social/useFriends";
import { Button, Heading, HStack, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text } from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";

interface ChallengeFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (deckId: number) => void;
  friend: FriendType;
  isAcceptingChallenge?: boolean;
}

export const ChallengeFriendModal = (props: ChallengeFriendModalProps) => {
  const user = useUser();
  const { data: myDecks } = useDecks(user?.id);
  const [selectedDeck, setSelectedDeck] = useState<number | undefined>();

  const hasNoDecks = myDecks?.length === 0;

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Challenge {props.friend.username}</ModalHeader>
        <ModalBody>
        <Stack>
          <Text>Select deck to play with</Text>
          {myDecks && myDecks.length > 0 && <HStack>{myDecks?.map((deck) => <Button isDisabled={deck.deck.length !== 60} key={'challenge-deck' + deck.id} colorScheme={selectedDeck === deck.id ? 'blue' : 'gray'} onClick={() => setSelectedDeck(deck.id)}>{deck.name}</Button>)}</HStack>}
          {hasNoDecks && <Text>You have no decks. Make one first before playing in a game!</Text>}
        </Stack>
        </ModalBody>
        <ModalFooter>
          <Button isDisabled={!selectedDeck} colorScheme='red' onClick={() => selectedDeck && props.onConfirm(selectedDeck)}>
            {props.isAcceptingChallenge ? 'Play' : 'Challenge'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}