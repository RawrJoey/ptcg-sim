import { useState } from 'react';
import { Button, HStack, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react"
import { DeckBuilder } from "./DeckBuilder";
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { getDeckLength } from './helpers';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useDecks } from '@/features/decks/useDecks';

export type BatchOfCards = Record<string, { count: number, card: PokemonTCG.Card }>;

export interface CardWithImage {
  id: string;
  image: string;
}

interface DeckBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeckBuilderModal = (props: DeckBuilderModalProps) => {
  const [cards, setCards] = useState<Record<string, { count: number, card: PokemonTCG.Card }>>({});
  const [deckName, setDeckName] = useState('');
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const { data: decks, refetch } = useDecks(user?.id);
  const toast = useToast();

  const handleDeckSave = async () => {
    if (deckName.length === 0) {
      return toast({
        status: 'error',
        title: 'Please put in a deck name'
      })
    }

    const res = await supabaseClient.from('Decks').insert({
      owner: user?.id,
      deck: cards,
      name: deckName
    });

    if (res.error) {
      return toast({
        status: 'error',
        title: 'Failed to save deck.',
        description: res.error.message
      })
    }

    await refetch();
    props.onClose();

    toast({
      status: 'success',
      title: 'Deck saved successfully!'
    });
  }

  return (
    <Modal isOpen={props.isOpen} onClose={() => {}} size='2xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create deck</ModalHeader>
        <ModalBody>
          <DeckBuilder cards={cards} setCards={setCards} deckName={deckName} setDeckName={setDeckName} />
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button onClick={props.onClose}>Cancel (lose changes)</Button>
            <Button colorScheme={'blue'} isDisabled={getDeckLength(cards) === 0} onClick={handleDeckSave}>Save deck</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}