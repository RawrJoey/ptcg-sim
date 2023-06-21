import { useState } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { DeckBuilder } from "./DeckBuilder";
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { getDeckLength } from './helpers';

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

  return (
    <Modal isOpen={props.isOpen} onClose={() => {}} size='2xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create deck</ModalHeader>
        <ModalBody>
          <DeckBuilder cards={cards} setCards={setCards} />
        </ModalBody>
        <ModalFooter>
          <Button onClick={props.onClose}>Cancel (lose changes)</Button>
          <Button colorScheme={'blue'}>Save deck</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}