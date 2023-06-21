import { Grid, HStack, Text } from "@chakra-ui/react"
import Head from "next/head";
import Image from "next/image";
import { Login } from "../Login";

export const AppBar = () => {
  return (
    <Grid gridTemplateColumns={'1fr auto'} backgroundColor='green.100' boxShadow='md' pr={4}>
      <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" />
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@500&family=Crete+Round&display=swap" rel="stylesheet" />
      </Head>
      <HStack spacing={'-1.5'} alignItems='center'>
        <Image src='/app-logo.png' alt='Twinleaf app logo' width='72' height='72' />
        <Text fontFamily={'Be Vietnam Pro'} fontSize='28' pt='3' fontWeight='500' color='gray.800'>twinleaf.gg</Text>
      </HStack>
      <Login />
    </Grid>
  )
}