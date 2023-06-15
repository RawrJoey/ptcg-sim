import { useAppSelector } from "@/app/hooks"
import { useHelperController } from "@/features/game/useHelperController"
import { usePhaseActions } from "@/features/game/usePhaseActions";
import { Button, Stack, Text } from "@chakra-ui/react"

export const HelperBubble = () => {
  const { text, actionText, isDisabled } = useHelperController();
  const { setPhaseStatus } = usePhaseActions();

  if (!text && !actionText) return null;

  return (
    <Stack>
      {text && <Text>{text}</Text>}
      {actionText && <Button isDisabled={isDisabled} onClick={() => setPhaseStatus('ok')}>{actionText}</Button>}
    </Stack>
  )
}