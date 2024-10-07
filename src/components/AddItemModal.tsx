// src/components/AddItemModal.tsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
  VStack,
  Spinner,
  useToast,
  Box,
  Text,
  ModalFooter,
} from '@chakra-ui/react';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  DocumentReference,
  doc,
  runTransaction,
} from 'firebase/firestore';
import { DBItem, Item, Reyvateil } from '../types/Reyvateils'; // Ensure these types are correctly defined
import { User } from 'firebase/auth';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  reyvateil: Reyvateil | null;
  inventory: Item[]; // Updated to use InventoryItem type
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
}

interface SelectOption {
  label: string;
  value: string; // Store item ID for simplicity
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  reyvateil,
  inventory,
  setInventory,
}) => {
  const [itemOptions, setItemOptions] = useState<SelectOption[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const db = getFirestore();

  // Fetch all items when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchAllItems = async () => {
        setLoading(true);
        try {
          const itemsRef = collection(db, 'items'); // Ensure 'items' collection exists
          const q = query(itemsRef);
          const querySnapshot = await getDocs(q);
          const items: SelectOption[] = [];
          querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            if (data && data.name) {
              items.push({ label: data.name, value: docSnapshot.id });
            }
          });
          setItemOptions(items);
        } catch (error) {
          console.error('Error fetching items:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch items. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      };

      fetchAllItems();
    } else {
      // Reset form when modal is closed
      setSelectedItemId('');
      setQuantity(1);
      setItemOptions([]);
    }
  }, [isOpen, db, toast]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!currentUser || !reyvateil) {
      toast({
        title: 'Error',
        description: 'No user or Reyvateil found.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!selectedItemId) {
      toast({
        title: 'Invalid Input',
        description: 'Please select an item.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (quantity <= 0) {
      toast({
        title: 'Invalid Quantity',
        description: 'Quantity must be at least 1.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      let newInventory = [...inventory];

      await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) {
          throw new Error('User data not found.');
        }

        // Reference to the selected item
        const selectedItemRef = doc(db, 'items', selectedItemId);
        const itemSnap = await transaction.get(selectedItemRef);
        if (!itemSnap.exists()) {
          throw new Error('Item not found.');
        }

        // Check if the item already exists in the inventory
        const existingItemIndex = newInventory.findIndex(
          (item) => item.id === selectedItemId
        );

        if (existingItemIndex !== -1) {
          // Item exists, update quantity
          const existingItem = newInventory[existingItemIndex];
          if (existingItem && existingItem.quantity) {
            existingItem.quantity += quantity;
          }
        } else {
          // Item does not exist, add to inventory
          newInventory.push({ ...itemSnap.data() as Item, quantity });
        }

        // Update the user's inventory in Firestore
        transaction.update(userRef, {
          inventory: newInventory.map((item) => ({
            reference: selectedItemRef,
            quantity: item.quantity,
          })),
        });
      });

      // Update local inventory state
      setInventory(newInventory);

      toast({
        title: 'Success',
        description: 'Item has been added to your inventory.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form and close modal
      setSelectedItemId('');
      setQuantity(1);
      onClose();
    } catch (error: any) {
      console.error('Transaction failed:', error);
      toast({
        title: 'Error',
        description: `Failed to add item: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent bg="gray.700">
        <ModalHeader color="white">Add New Item</ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody>
          <VStack spacing={4}>
            {/* Item Selection */}
            <FormControl id="item-name" isRequired>
              <FormLabel color="white">Item Name</FormLabel>
              {loading ? (
                <Spinner />
              ) : (
                <Select
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  bg="black"
                  color="white"
                  _hover={{ bg: 'gray.500' }}
                >
                  {itemOptions.map((option) => (
                    <option style={{ backgroundColor: 'black', color: 'white' }} key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              )}
            </FormControl>

            {/* Quantity Input */}
            <FormControl id="quantity" isRequired>
              <FormLabel color="white">Quantity</FormLabel>
              <NumberInput
                min={1}
                value={quantity}
                onChange={(valueString) => setQuantity(Number(valueString))}
              >
                <NumberInputField bg="gray.600" color="white" />
              </NumberInput>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3} colorScheme="gray">
            Cancel
          </Button>
          <Button onClick={handleSubmit} colorScheme="blue">
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddItemModal;
