import { useState } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea } from "@chakra-ui/react"

interface DeckImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deckList: string) => void; 
}

export const DeckImportModal = (props: DeckImportModalProps) => {
  const [deckList, setDeckList] = useState('');

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Import deck list</ModalHeader>
        <ModalBody>
          <Textarea placeholder="Paste PTCG Live deck list here..." onChange={e => setDeckList(e.target.value)} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' isDisabled={deckList.length === 0} onClick={() => props.onSubmit(deckList)}>Import</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}