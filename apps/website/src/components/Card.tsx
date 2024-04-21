import { type CardProps, Card as ChakraCard } from "@chakra-ui/react"

function Card(props: CardProps) {
  const {children} = props
  return (
    <ChakraCard boxShadow="xl" padding={1} rounded="xl" size="sm" {...props}>
      {children}
    </ChakraCard>
  )
}

export { Card }
