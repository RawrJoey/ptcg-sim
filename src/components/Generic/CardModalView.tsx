import {
  Modal,
  ModalOverlay,
  ModalContent,
  Grid,
  HStack,
} from '@chakra-ui/react';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { CardInterface, CardObject } from '../Card/CardInterface';
import { CardZone, DraggableCard } from '../Card/DraggableCard';

export interface SpecificCardModalViewProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void
  cards: CardObject[];
}

export interface CardModalViewProps extends SpecificCardModalViewProps {
  cardOrigin: CardZone
}

export const CardModalView = (props: CardModalViewProps) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size='6xl'>
      <ModalOverlay />
      <ModalContent>
        <HStack maxWidth={'100%'} spacing={0} flexWrap={'wrap'}>
          {props.cards.map((card) => <DraggableCard key={card.uuid} card={card} size='md' hoverBehavior='float' onDrag={props.onClose} onFailedRelease={props.onOpen} cardOrigin={props.cardOrigin} />)}
        </HStack>
      </ModalContent>
    </Modal>
  )
}