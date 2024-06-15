import {
  Box,
  type BoxProps,
  Button,
  Center,
  Modal as ChakraModal,
  Flex,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { Bold, Divider, InlineTip } from "@components";
import React from "react";

import { Styles } from "../css";

export interface ModalProps {
  children: JSX.Element;
  hasBorder?: boolean;
  maxW?: BoxProps["maxW"];
  title: string;
}
type BorderProps = Pick<BoxProps, "border" | "borderColor" | "borderRadius">;

export function Modal({
  children,
  hasBorder = false,
  maxW = "4xl",
  title,
}: ModalProps): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const borderProps: BorderProps = {
    border: "1px",
    borderColor: Styles.borderColorMed,
    borderRadius: "xl",
  };
  return (
    <>
      <Box boxShadow={Styles.boxShadowMin} maxW={maxW} p={5} rounded={"xl"}>
        <Bold fontSize={"lg"}>{title}</Bold>
        <Center>
          <InlineTip
            appendText={"Click on the image to zoom in"}
            label={"Tip"}
          />
        </Center>
        <Box marginTop={3}>
          <Divider />
        </Box>
        <Center>
          <Flex
            mt={5}
            onClick={() => {
              onOpen();
            }}
            {...(hasBorder ? borderProps : null)}
            overflow={"auto"}
          >
            {children}
          </Flex>
        </Center>
        <ChakraModal
          isOpen={isOpen}
          // motionPreset: If you leverage a preset, it will distort the SVG text
          motionPreset={"none"}
          onClose={onClose}
          scrollBehavior={"inside"}
          size="6xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{title}</ModalHeader>
            <ModalCloseButton
              border={"1px"}
              borderColor={Styles.borderColorMed}
            />
            <ModalBody>
              <Center>
                <Box {...(hasBorder ? borderProps : null)} overflow="auto">
                  {children}
                </Box>
              </Center>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </ChakraModal>
      </Box>
    </>
  );
}
