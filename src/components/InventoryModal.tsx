// src/components/InventoryModal.tsx
import React from 'react';
import {
  Box,
  Button,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Text,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { Item, Reyvateil } from '../types/Reyvateils';
import { User } from 'firebase/auth';
import AddItemModal from './AddItemModal';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: Item[];
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
  currentUser: User | null;
  reyvateil: Reyvateil | null;
}

const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  inventory,
  setInventory,
  currentUser,
  reyvateil,
}) => {
  const { isOpen: isAddItemOpen, onOpen: onAddItemOpen, onClose: onAddItemClose } = useDisclosure();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent bg="secondary">
          <ModalHeader color="textHeader">Your Inventory</ModalHeader>
          <ModalCloseButton color="text" />
          <ModalBody>
            {/* Add Item Button */}
            <Button onClick={onAddItemOpen} colorScheme="blue" mb={4}>
              Add Item
            </Button>

            <VStack spacing={4} align="stretch">
              {inventory.map((item) => (
                <Box key={item.id} p={3} bg="accent" rounded="md">
                  <Text color="text" fontWeight="bold">
                    {item.name} (x{item.quantity})
                  </Text>
                  <Text color="text">{item.description}</Text>
                </Box>
              ))}
              {inventory.length === 0 && (
                <Text color="text" textAlign="center">
                  Your inventory is empty.
                </Text>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} colorScheme="gray">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={onAddItemClose}
        currentUser={currentUser}
        reyvateil={reyvateil}
        inventory={inventory}
        setInventory={setInventory}
      />
    </>
  );
};

export default InventoryModal;
