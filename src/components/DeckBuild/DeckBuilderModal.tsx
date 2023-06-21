import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { DeckBuilder } from "./DeckBuilder";

interface DeckBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeckBuilderModal = (props: DeckBuilderModalProps) => {
  const isSaveDeckDisabled = true;

  return (
    <Modal isOpen={props.isOpen} onClose={() => {}} size='2xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create deck</ModalHeader>
        <ModalBody>
          <DeckBuilder />
        </ModalBody>
        <ModalFooter>
          <Button onClick={props.onClose}>Cancel (lose changes)</Button>
          <Button isDisabled={isSaveDeckDisabled}>Save deck</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}