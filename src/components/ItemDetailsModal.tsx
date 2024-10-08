// src/components/ItemDetailsModal.tsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Text,
  Image,
  VStack,
  useDisclosure,
  useToast,
  Spinner,
  Box,
} from '@chakra-ui/react';
import { Item } from '../types/Reyvateils';
import { User } from 'firebase/auth';
import RemoveItemModal from './RemoveItemModal';
import { doc, runTransaction } from 'firebase/firestore';
import { db } from '../Firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../Firebase';

interface ItemDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
  inventory: Item[];
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
  currentUser: User | null;
  unlockedRecipes: string[];
  setUnlockedRecipes: (recipe: string) => Promise<void>;
}

const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  isOpen,
  onClose,
  item,
  inventory,
  setInventory,
  currentUser,
  unlockedRecipes,
  setUnlockedRecipes,
}) => {
  const {
    isOpen: isRemoveModalOpen,
    onOpen: onRemoveModalOpen,
    onClose: onRemoveModalClose,
  } = useDisclosure();
  const toast = useToast();

  const [imageUrl, setImageUrl] = useState<string>('placeholder-image.png');
  const [loadingImage, setLoadingImage] = useState<boolean>(true);

  useEffect(() => {
    const fetchImage = async () => {
      if (item) {
        try {
          const imageRef = ref(storage, "items/" + item.name + ".png");
          const url = await getDownloadURL(imageRef);
          setImageUrl(url);
        } catch (error) {
          console.error('Error fetching item image:', error);
        }
      }
      setLoadingImage(false);
    };

    fetchImage();
  }, [item]);

  const handleDissimulate = async () => {
    if (!currentUser) return;

    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) throw new Error('User does not exist');

        const userData = userSnap.data();
        const newUnlockedRecipes = [...(userData.unlockedRecipes || [])];

        // Update inventory
        const newInventory = [...inventory];
        const itemIndex = newInventory.findIndex((i) => i.id === item.id);
        if (itemIndex !== -1) {
          const inv = newInventory[itemIndex];

          if (inv.quantity) {
            if (inv.quantity < 10) {
              throw new Error('Not enough items. You need ' + (10 - inv.quantity) + " more.");
            } else {
              inv.quantity -= 10;
              if (inv.quantity <= 0) {
                newInventory.splice(itemIndex, 1);
              }
            }
          } else {
            throw new Error('Item quantity is undefined.');
          }
        } else {
          throw new Error('Item not found in inventory.');
        }

        if (!newUnlockedRecipes.includes(item.id)) {
          newUnlockedRecipes.push(item.id);
        }

        // Update user data in transaction
        transaction.update(userRef, { unlockedRecipes: newUnlockedRecipes, inventory: newInventory });
      });

      setUnlockedRecipes(item.id);

      toast({
        title: 'Recipe Unlocked',
        description: `You have unlocked the recipe for ${item.name}!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error: any) {
      console.error('Error during dissimulation:', error);
      toast({
        title: 'Error',
        description: `Failed to unlock recipe: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const hasRecipe = unlockedRecipes.includes(item.id);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <ModalOverlay />
        <ModalContent bg="secondary">
          <ModalHeader color="textHeader">{item.name}</ModalHeader>
          <ModalCloseButton color="text" />
          <ModalBody>
            <VStack spacing={4} align="center">
              {loadingImage ? (
                <Spinner size="md" />
              ) : (
                <Image
                  src={imageUrl}
                  alt={item.name}
                  boxSize="150px"
                  objectFit="cover"
                />
              )}
              <Text color="text">{item.description}</Text>
              <Text color="text">
                Quantity: <strong>{item.quantity}</strong>
              </Text>
              <Text color="text">Category: {item.category}</Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={onRemoveModalOpen} mr={3}>
              Remove
            </Button>
            {!hasRecipe && (
              <Button colorScheme="blue" onClick={handleDissimulate}>
                Dissimulate
              </Button>
            )}
            <Button onClick={onClose} ml={3}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Remove Item Modal */}
      <RemoveItemModal
        isOpen={isRemoveModalOpen}
        onClose={onRemoveModalClose}
        item={item}
        inventory={inventory}
        setInventory={setInventory}
        currentUser={currentUser}
      />
    </>
  );
};

export default ItemDetailsModal;
