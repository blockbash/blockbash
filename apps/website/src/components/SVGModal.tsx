import {
  Box,
  Button,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

interface SVGModalProps {
  SVG: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
}

export function SVGModal({ SVG, title }: SVGModalProps): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Box marginTop={"10"}>
      <SVG
        onClick={() => {
          onOpen();
        }}
      />
      <Modal
        isOpen={isOpen}
        motionPreset={"scale"}
        onClose={onClose}
        size="6xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SVG />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
