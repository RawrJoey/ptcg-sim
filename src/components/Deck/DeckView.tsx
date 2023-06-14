import {
  Modal,
  ModalOverlay,
  ModalContent,
  Grid,
  HStack,
} from '@chakra-ui/react';
import { Card } from '../Card/Card';
import { CardInterface } from '../Card/CardInterface';
import { DraggableCard } from '../Card/DraggableCard';

interface DeckViewProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void
  deck: CardInterface[];
}

export const DeckView = (props: DeckViewProps) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size='6xl'>
      <ModalOverlay />
      <ModalContent>
        <HStack maxWidth={'100%'} spacing={0} flexWrap={'wrap'}>
          {props.deck.map((card) => <DraggableCard card={card} size='md' hoverBehavior='float' onDrag={props.onClose} onFailedRelease={props.onOpen} />)}
        </HStack>
      </ModalContent>
    </Modal>
  )
}