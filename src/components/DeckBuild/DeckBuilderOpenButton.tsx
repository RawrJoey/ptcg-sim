import { Button, useDisclosure } from "@chakra-ui/react"
import { DeckBuilderModal } from "./DeckBuilderModal";

export const DeckBuilderOpenButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <DeckBuilderModal isOpen={isOpen} onClose={onClose} />
      <Button onClick={onOpen}>Create a deck</Button>
    </>
  )
}