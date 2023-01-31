import { Heading, Stack, Text } from '@chakra-ui/react';
import { Inter } from '@next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <Stack height='100%' justifyContent={'center'} align='center'>
      <Heading size='2xl'>The new PTCG Live.</Heading>
      <Text fontSize='xl'>{`Coming April. Probably.`}</Text>
    </Stack>
  );
}
