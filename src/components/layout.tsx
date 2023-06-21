import { PropsWithChildren } from 'react'
import { Stack } from "@chakra-ui/react"
import { AppBar } from "./AppBar/AppBar"

export const Layout = (props: PropsWithChildren) => {
  return (
    <Stack width='100%'>
      <AppBar />
      {props.children}
    </Stack>
  )
}