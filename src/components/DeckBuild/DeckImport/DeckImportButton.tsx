import { useState } from 'react';
import { Button, useDisclosure, useToast } from "@chakra-ui/react"
import { BatchOfCards, DeckBuilderModal } from "../DeckBuilderModal";
import { DeckImportModal } from "./DeckImportModal";
import { loadDeckList } from '@/features/game/helpers';
import { useCodeToSetMap } from '@/hooks/useCodeToSetMap';

export const DeckImportButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingDeck, setEditingDeck] = useState<BatchOfCards | undefined>();
  const { data: codeToSetMap } = useCodeToSetMap();

  const { isOpen: isEditorOpen, onOpen: onEditorOpen, onClose: onEditorClose } = useDisclosure();
  const toast = useToast();

  const onListImport = async (deckList: string) => {
    const deck = await loadDeckList(deckList, codeToSetMap);
    setEditingDeck(deck);
    onClose();
    onEditorOpen();
    toast({
      status: 'success',
      title: 'Deck imported!'
    })
  }

  return (
    <>
      {editingDeck && <DeckBuilderModal isOpen={isEditorOpen} onClose={onEditorClose} editingDeck={{ deck: editingDeck}} /> }
      <DeckImportModal isOpen={isOpen} onClose={onClose} onSubmit={onListImport} />
      <Button onClick={onOpen}>Import deck list</Button>
    </>
  )
}