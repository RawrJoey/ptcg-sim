import { useHelperController } from "@/features/game/useHelperController"
import { Button, HStack, Stack, Text } from "@chakra-ui/react"

export const HelperBubble = () => {
  const { text, actions, isDisabled } = useHelperController();

  if (!text && !actions) return null;

  return (
    <Stack>
      {text && <Text>{text}</Text>}
      <HStack>
        {actions?.map((action) => (
          <Button isDisabled={isDisabled} onClick={action.onClick}>{action.text}</Button>
        ))}
      </HStack>
    </Stack>
  )
}