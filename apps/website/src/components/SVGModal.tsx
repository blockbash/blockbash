import {
  Box,
  Button,
  Center, Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import React from "react";

interface SVGModalProps {
  SVG: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
}

export function SVGModal({ SVG, title }: SVGModalProps): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Flex marginTop={"10"}>
      <SVG
        onClick={() => {
          onOpen();
        }}
      />
      <Modal
        isOpen={isOpen}
        scrollBehavior={"inside"}
        motionPreset={"scale"}
        onClose={onClose}
        size="6xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex minWidth={"fit-content"}>
              <SVG />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
