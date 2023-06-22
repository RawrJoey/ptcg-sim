import { useState, useEffect } from 'react';
import { Button, HStack, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react"
import { DeckBuilder } from "./DeckBuilder";
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { getDeckLength } from './helpers';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { SavedDeck, useDecks } from '@/features/decks/useDecks';

export type BatchOfCards = Record<string, { count: number, card: PokemonTCG.Card }>;

export interface CardWithImage {
  id: string;
  image: string;
}

interface DeckBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingDeck?: SavedDeck;
}

export const DeckBuilderModal = (props: DeckBuilderModalProps) => {
  const [cards, setCards] = useState<BatchOfCards>({});
  const [deckName, setDeckName] = useState('');
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const { data: decks, refetch } = useDecks(user?.id);
  const toast = useToast();

  useEffect(() => {
    if (props.editingDeck?.deck) {
      setCards(props.editingDeck.deck)
    }
  }, [props.editingDeck?.deck])

  const handleDeckSave = async () => {
    let res;
    if (props.editingDeck) {
      res = await supabaseClient.from('Decks').update({
        deck: cards
      }).match({ id: props.editingDeck.id });
    } else {
      if (deckName.length === 0) {
        return toast({
          status: 'error',
          title: 'Please put in a deck name'
        })
      }

      res = await supabaseClient.from('Decks').insert({
        owner: user?.id,
        deck: cards,
        name: deckName
      });
    }

    if (res?.error) {
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
    <Modal isOpen={props.isOpen} onClose={() => {}} size='4xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{props.editingDeck ? `${props.editingDeck.name} (${getDeckLength(cards)})` : 'Create deck'}</ModalHeader>
        <ModalBody>
          <DeckBuilder cards={cards} setCards={setCards} deckName={deckName} setDeckName={setDeckName} editingDeck={props.editingDeck} />
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