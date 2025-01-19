// FullScreenMapModal.tsx

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
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Map</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0} height="100vh">
          {/* Render the entire MapPage here */}
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
