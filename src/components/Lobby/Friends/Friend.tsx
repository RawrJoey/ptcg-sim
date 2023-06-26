import { useDecks } from "@/features/decks/useDecks";
import { loadDeck } from "@/features/game/gameSlice";
import { loadSavedDeck } from "@/features/game/helpers";
import { acceptChallenge, sendChallenge } from "@/features/social/challenges/mutators";
import { useActiveChallenges } from "@/features/social/challenges/useActiveChallenges";
import { FriendType } from "@/features/social/useFriends"
import { Avatar, AvatarBadge, Button, HStack, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { ChallengeFriendModal } from "./ChallengeFriendModal";

interface FriendProps {
  friend: FriendType;
  isOnline?: boolean;
}

export const Friend = (props: FriendProps) => {
  // Used for the second you press challenge, want it to be disabled
  const [tempDisable, setTempDisable] = useState(false);

  const dispatch = useDispatch();
  const supabase = useSupabaseClient();
  const user = useUser();
  const { data: decks } = useDecks(user?.id);
  const { data: activeFriendChallenges, refetch } = useActiveChallenges(props.friend.id);
  const alreadyChallenged = tempDisable || activeFriendChallenges?.some((friendOfFriend) => friendOfFriend.challenger === user?.id);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAcceptingOpen, onOpen: onAcceptingOpen, onClose: onAcceptingClose } = useDisclosure();
  const toast = useToast();

  const handleAcceptChallenge = async (deckId: number) => {
    if (!props.friend.challengeId) return;

    await acceptChallenge(supabase, props.friend.challengeId, deckId);
    
    const foundDeck = decks?.find((deck) => deck.id === deckId);

    if (!foundDeck) return console.error('Not found accepting deck, send help')
    const loadedDeck = await loadSavedDeck(foundDeck.deck);

    dispatch(loadDeck({ payload: loadedDeck }));
    refetch();
  }

  const handleSendChallenge = (deckId: number) => {
    setTempDisable(true);
    user && sendChallenge(supabase, user.id, props.friend.id, deckId);
    onClose();
    toast({
      title: 'Challenge sent'
    })
  }

  if (!user) return <Text>{'Loading...'}</Text>;

  return (
    <HStack spacing={4}>
      <ChallengeFriendModal isOpen={isOpen} onClose={onClose} onConfirm={handleSendChallenge} friend={props.friend} />
      <ChallengeFriendModal isOpen={isAcceptingOpen} onClose={onAcceptingClose} onConfirm={handleAcceptChallenge} friend={props.friend} isAcceptingChallenge />
      <Avatar>
        <AvatarBadge borderColor='papayawhip' bg={props.isOnline ? 'green.500' : 'tomato'} boxSize='1.25em' />
      </Avatar>
      <Text>{props.friend.username}</Text>
      {!props.friend.challengeId && (
        <Button isDisabled={alreadyChallenged} onClick={onOpen}>{alreadyChallenged ? 'Waiting...' : 'Challenge'}</Button>
      )
      }
      {props.friend.challengeId && (
        <Button colorScheme='red' onClick={onAcceptingOpen}>
          Accept challenge
        </Button>
      )}
    </HStack>
  )
}