import { useCurrentProfile } from "@/features/social/useCurrentProfile";
import { useProfile } from "@/features/social/useProfile";
import { Button, HStack, Text } from "@chakra-ui/react";
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

export const Login = () => {
  const user = useUser();
  const { data: profile } = useCurrentProfile();
  const supabaseClient = useSupabaseClient();

  const handleLogInClick = async () => {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
    });
  }

  const handleLogOutClick = async () => {
    await supabaseClient.auth.signOut();
  }  

  if (user) return <HStack>
    {profile && <Text>Hi, {profile?.name}!</Text>}
    <Button colorScheme='blue' onClick={handleLogOutClick} variant='outline' size='sm'>Log out</Button>
  </HStack>

  return <HStack>
    <Button colorScheme='blue' onClick={handleLogInClick}>Log in</Button>
    <Button onClick={() => supabaseClient.auth.signInWithPassword({ email: 'dummy@gmail.com', password: 'password' })}>Log in test account 1</Button>
    <Button onClick={() => supabaseClient.auth.signInWithPassword({ email: 'dummy2@gmail.com', password: 'password' })}>Log in test account 2</Button>
  </HStack>
}