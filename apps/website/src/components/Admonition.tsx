import { Alert, AlertDescription, AlertIcon, AlertProps, Box } from "@chakra-ui/react";

interface AdmonitionProps extends AlertProps {
  text: string
}

export function Admonition({text, status = "info"}: AdmonitionProps) {
  return (
    <Alert status={status}>
      <AlertIcon/>
      <Box>
        <AlertDescription>
          {text}
        </AlertDescription>
      </Box>
    </Alert>
  )
}
