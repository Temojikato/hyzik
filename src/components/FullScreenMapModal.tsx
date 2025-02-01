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
  useDisclosure,
  background
} from '@chakra-ui/react';
import MapPage from './MapPage'; // your existing MapPage
import { Item } from '../types/Reyvateils';
import { User } from 'firebase/auth';

interface FullScreenMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: Item[];
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
  currentUser: User | null;
}

const FullScreenMapModal: React.FC<FullScreenMapModalProps> = ({ isOpen, onClose, inventory, setInventory, currentUser }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Map</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0} height="100vh">
          {/* Render the entire MapPage here */}
          <MapPage inventory={inventory} setInventory={setInventory} currentUser={currentUser}/>
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
