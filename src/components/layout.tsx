import { PropsWithChildren } from 'react'
import { Stack } from "@chakra-ui/react"
import { AppBar } from "./AppBar/AppBar"

export const Layout = (props: PropsWithChildren) => {
  return (
    <Stack>
      <AppBar />
      {props.children}
    </Stack>
  )
}