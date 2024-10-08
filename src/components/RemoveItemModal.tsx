// src/components/RemoveItemModal.tsx

import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  NumberInput,
  NumberInputField,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { Item } from '../types/Reyvateils';
import { User } from 'firebase/auth';
import { doc, runTransaction } from 'firebase/firestore';
import { db } from '../Firebase';

interface RemoveItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
  inventory: Item[];
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
  currentUser: User | null;
}

const RemoveItemModal: React.FC<RemoveItemModalProps> = ({
  isOpen,
  onClose,
  item,
  inventory,
  setInventory,
  currentUser,
}) => {
  const [quantityToRemove, setQuantityToRemove] = useState<number>(1);
  const toast = useToast();

  const handleRemove = async () => {
    if (!currentUser) return;

    if (quantityToRemove < 1 || quantityToRemove > (item.quantity || 0)) {
      toast({
        title: 'Invalid Quantity',
        description: 'Please enter a valid quantity to remove.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) throw new Error('User does not exist');

        // Update inventory
        const newInventory = [...inventory];
        const itemIndex = newInventory.findIndex((i) => i.id === item.id);
        if (itemIndex !== -1) {
          const inv = newInventory[itemIndex];
          if (inv.quantity) {
            inv.quantity -= 1;
            if (inv.quantity <= 0) {
              newInventory.splice(itemIndex, 1);
            }
          }
        }
        transaction.update(userRef, { inventory: newInventory });
      });

      // Update local state
      setInventory((prevInventory) => {
        const newInventory = [...prevInventory];
        const itemIndex = newInventory.findIndex((i) => i.id === item.id);
        if (itemIndex !== -1) {
          const inv = newInventory[itemIndex];
          if (inv.quantity) {
            inv.quantity -= 1;
            if (inv.quantity <= 0) {
              newInventory.splice(itemIndex, 1);
            }
          }
        }
        return newInventory;
      });

      toast({
        title: 'Item Removed',
        description: `Removed ${quantityToRemove} of ${item.name} from your inventory.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error: any) {
      console.error('Error removing item:', error);
      toast({
        title: 'Error',
        description: `Failed to remove item: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xs" isCentered>
      <ModalOverlay />
      <ModalContent bg="secondary">
        <ModalHeader color="textHeader">Remove Item</ModalHeader>
        <ModalCloseButton color="text" />
        <ModalBody>
          <VStack spacing={4} align="center">
            <Text color="text">How many {item.name} do you want to remove?</Text>
            <NumberInput
              defaultValue={1}
              min={1}
              max={item.quantity || 1}
              value={quantityToRemove}
              onChange={(valueString) => setQuantityToRemove(Number(valueString))}
            >
              <NumberInputField bg="white" />
            </NumberInput>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" onClick={handleRemove} mr={3}>
            Remove
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RemoveItemModal;
