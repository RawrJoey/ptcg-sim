import { useState } from 'react';
import { SavedDeck, useDecks } from "@/features/decks/useDecks"
import { Button, Heading, HStack, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import { DeckBuilderModal } from "./DeckBuilderModal";

export const ListOfMyDecks = () => {
  const [currentlyEditingDeck, setCurrentlyEditingDeck] = useState<SavedDeck | undefined>();
  const user = useUser();
  const { data: decks } = useDecks(user?.id);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Stack>
      <Heading>My decks</Heading>
      <DeckBuilderModal isOpen={isOpen} onClose={onClose} editingDeck={currentlyEditingDeck} />
      {decks?.map((deck) => (
        <HStack key={deck.id + '-my-deck'}>
          <Text>{deck.name}</Text>
          <Button onClick={() => {
            setCurrentlyEditingDeck(deck);
            onOpen();
          }}>Edit</Button>
        </HStack>
      ))}
    </Stack>
  )
}