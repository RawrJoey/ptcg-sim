import {
  Modal,
  ModalOverlay,
  ModalContent,
} from '@chakra-ui/react';
import { Card } from '../Card/Card';
import { CardInterface } from '../Card/CardInterface';

interface DeckViewProps {
  isOpen: boolean;
  onClose: () => void
  deck: CardInterface[];
}

export const DeckView = (props: DeckViewProps) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        {props.deck.map((card) => <Card card={card} size='md' hoverBehavior='bevel' />)}
      </ModalContent>
    </Modal>
  )
}