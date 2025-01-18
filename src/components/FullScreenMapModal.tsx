import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import MapPage from './MapPage'; // your existing MapPage

interface FullScreenMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FullScreenMapModal: React.FC<FullScreenMapModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Map</ModalHeader>
        {/* This automatically places an "X" button in the top-right corner */}
        <ModalCloseButton />
        <ModalBody p={0}>
          {/* You can render your entire MapPage here */}
          <MapPage />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} colorScheme="blue">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FullScreenMapModal;
