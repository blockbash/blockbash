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
  chakra,
  useDisclosure,
} from "@chakra-ui/react";
import { Bold, Divider, Tip } from "@components";
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
  maxW = ["xs", "xs", "md"],
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
      <Box
        background={"white"}
        boxShadow={Styles.boxShadowMin}
        maxW={maxW}
        mx={"auto"}
        p={5}
        rounded={"xl"}
      >
        <Box mb={2}>
          <Bold fontSize={"lg"}>{title}</Bold>
        </Box>
        <Center>
          <Tip>
            <chakra.span>Click on the image to zoom in</chakra.span>
          </Tip>
        </Center>
        <Box my={3}>
          <Divider />
        </Box>
        <Center>
          <Flex
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
          allowPinchZoom={true}
          isOpen={isOpen}
          // motionPreset: If you leverage a preset, it will distort the SVG text
          motionPreset={"none"}
          onClose={onClose}
          scrollBehavior={"inside"}
          size="full"
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
