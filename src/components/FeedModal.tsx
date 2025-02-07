// src/components/FeedModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Text,
  RadioGroup,
  Radio,
  Stack,
} from '@chakra-ui/react';
import { Item } from '../types/Reyvateils';

interface FeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: Item[];
  onConfirm: (selectedItem: Item) => void;
}

const FeedModal: React.FC<FeedModalProps> = ({ isOpen, onClose, inventory, onConfirm }) => {
  // Filter out only items that are of the category "Lesser Spirit Food"
  const feedItems = inventory.filter((item) => item.category === 'Lesser Spirit Food');
  const [selectedItemId, setSelectedItemId] = useState<string>('');

  // Reset selection when the modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedItemId('');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    const selectedItem = feedItems.find((item) => item.id === selectedItemId);
    if (selectedItem) {
      onConfirm(selectedItem);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
      <ModalOverlay />
      <ModalContent bg="secondary">
        <ModalHeader color="textHeader">Choose Feed Item</ModalHeader>
        <ModalBody>
          {feedItems.length > 0 ? (
            <RadioGroup onChange={setSelectedItemId} value={selectedItemId}>
              <Stack direction="column">
                {feedItems.map((item) => (
                  <Radio key={item.id} value={item.id}>
                    <VStack align="start" spacing={0}>
                      <Text color="text" fontWeight="bold">
                        {item.name}
                      </Text>
                      <Text color="text">Quantity: {item.quantity}</Text>
                    </VStack>
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          ) : (
            <Text color="text">No feed items available in your inventory.</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleConfirm} disabled={!selectedItemId}>
            Confirm
          </Button>
          <Button variant="ghost" onClick={onClose} ml={3}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FeedModal;
