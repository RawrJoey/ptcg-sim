import { Button, HStack, Text } from "@chakra-ui/react";
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

export const Login = () => {
  const user = useUser();
  const supabaseClient = useSupabaseClient();
  console.log(user)

  const handleLogInClick = async () => {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'discord',
    });
  }

  const handleLogOutClick = async () => {
    await supabaseClient.auth.signOut();
  }

  if (user) return <HStack>
    <Text>Hi, {user.user_metadata.full_name}!</Text>
    <Button colorScheme='purple' onClick={handleLogOutClick} variant='outline' size='sm'>Log out</Button>
  </HStack>

  return <Button colorScheme='purple' onClick={handleLogInClick}>Log in</Button>
}