import { useToast } from "@chakra-ui/react"

export const useInfoToast = () => {
  const toast = useToast();

  const retToast = (message: string) => toast({
    title: message,
    status: 'info',
    variant: 'subtle',
    position: 'top',
    duration: 4000,
  });

  return retToast;
}