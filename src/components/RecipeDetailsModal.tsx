// src/components/RecipeDetailsModal.tsx

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
  HStack,
  useToast,
  Spinner,
  Box,
} from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { Item } from '../types/Reyvateils';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../Firebase';
import { getFirestore, collection, query, where, getDocs, runTransaction, doc } from 'firebase/firestore';

interface RecipeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Item;
  inventory: Item[];
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
  currentUser: User | null;
}

interface ComponentItem extends Item {
  quantityNeeded: number;
}

const RecipeDetailsModal: React.FC<RecipeDetailsModalProps> = ({
  isOpen,
  onClose,
  recipe,
  inventory,
  setInventory,
  currentUser,
}) => {
  const toast = useToast();
  const [imageUrl, setImageUrl] = useState<string>('placeholder-image.png');
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const [componentItems, setComponentItems] = useState<ComponentItem[]>([]);
  const [loadingComponents, setLoadingComponents] = useState<boolean>(false);
  const db = getFirestore();

  useEffect(() => {
    const fetchImage = async () => {
      if (recipe) {
        try {
          const url = await getDownloadURL(ref(storage, 'items/' + recipe.name + '.png'));
          setImageUrl(url);
        } catch (error) {
          console.error('Error fetching recipe image:', error);
        }
      }
      setLoadingImage(false);
    };

    fetchImage();
  }, [recipe]);

  useEffect(() => {
    const fetchComponents = async () => {
      setLoadingComponents(true);
      try {
        // Prepare component counts
        const componentCounts: { [itemId: string]: number } = {};
        for (const component of recipe.recipe) {
          if (typeof component === 'string') {
            // If component is a string, count occurrences
            componentCounts[component] = (componentCounts[component] || 0) + 1;
          } else if (typeof component === 'object' && component.itemId && component.quantity) {
            // If component is an object, use itemId and quantity
            componentCounts[component.itemId] = (componentCounts[component.itemId] || 0) + component.quantity;
          } else {
            throw new Error('Invalid component format in recipe.');
          }
        }

        // Fetch components from Firestore
        const componentItemIds = Object.keys(componentCounts);
        const batches = [];
        const batchSize = 10;
        const itemsRef = collection(db, 'items');

        for (let i = 0; i < componentItemIds.length; i += batchSize) {
          const batch = componentItemIds.slice(i, i + batchSize);
          const q = query(itemsRef, where('__name__', 'in', batch));
          batches.push(getDocs(q));
        }

        const results = await Promise.all(batches);
        const items: ComponentItem[] = [];
        results.forEach((querySnapshot) => {
          querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data() as Item;
            const itemId = docSnapshot.id;
            const quantityNeeded = componentCounts[itemId];
            items.push({
              ...data,
              id: itemId,
              quantityNeeded,
            });
          });
        });

        setComponentItems(items);
      } catch (error: any) {
        console.error('Error fetching component items:', error);
        toast({
          title: 'Error',
          description: `Failed to fetch component items: ${error.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoadingComponents(false);
      }
    };

    if (recipe.recipe && recipe.recipe.length > 0) {
      fetchComponents();
    }
  }, [recipe, db, toast]);

  const handleCraft = async () => {
    if (!currentUser) return;

    try {
      let updatedInventory: Item[] = [];

      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) throw new Error('User does not exist');

        const userData = userSnap.data();
        const newInventory = [...inventory];

        // Check if user has all required components
        for (const component of componentItems) {
          const inventoryItem = newInventory.find((i) => i.name === component.name);
          const invQuantity = inventoryItem?.quantity || 0;
          if (invQuantity < component.quantityNeeded) {
            throw new Error(`You do not have enough of ${component.name}.`);
          }
        }

        // Remove components from inventory
        for (const component of componentItems) {
          const itemIndex = newInventory.findIndex((i) => i.name === component.name);
          if (itemIndex !== -1) {
            const invItem = newInventory[itemIndex];
            if (invItem.quantity !== undefined) {
              invItem.quantity -= component.quantityNeeded;
              if (invItem.quantity <= 0) {
                newInventory.splice(itemIndex, 1);
              }
            }
          }
        }

        // Add crafted item to inventory
        const craftedItemIndex = newInventory.findIndex((i) => i.name === recipe.name);
        if (craftedItemIndex !== -1) {
          const invItem = newInventory[craftedItemIndex];
          if (invItem.quantity !== undefined) {
            invItem.quantity += 1;
          }
        } else {
          // Add the crafted item to inventory
          newInventory.push({
            ...recipe,
            quantity: 1,
          });
        }

        // Update user data in transaction
        transaction.update(userRef, {
          inventory: newInventory,
        });

        // Save updated inventory to use after transaction
        updatedInventory = newInventory;
      });

      // Update local state
      setInventory(updatedInventory);

      toast({
        title: 'Item Crafted',
        description: `You have crafted ${recipe.name}!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose();
    } catch (error: any) {
      console.error('Error during crafting:', error);
      toast({
        title: 'Error',
        description: `Failed to craft item: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };


  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent bg="secondary">
          <ModalHeader color="textHeader">{recipe.name}</ModalHeader>
          <ModalCloseButton color="text" />
          <ModalBody>
            <VStack spacing={4} align="center">
              {loadingImage ? (
                <Spinner size="md" />
              ) : (
                <Image
                  src={imageUrl}
                  alt={recipe.name}
                  boxSize="150px"
                  objectFit="cover"
                />
              )}
              <Text color="text">{recipe.description}</Text>
              <Text color="text">Category: {recipe.category}</Text>

              <Text color="textHeader" fontWeight="bold" mt={4}>
                { componentItems.length > 0 ?  "Components Required:" : "Cannot be crafted"}
              </Text>
              {loadingComponents ? (
                <Spinner size="md" />
              ) : (
                componentItems.map((componentItem) => (
                  <Box
                    key={componentItem.id}
                    p={3}
                    bg="accent"
                    rounded="md"
                    w="100%"
                  >
                    <HStack spacing={4}>
                      <ComponentImage
                        imagePath={'items/' + componentItem.name + '.png'}
                        itemName={componentItem.name}
                      />
                      <VStack align="start" spacing={1}>
                        <Text color="text" fontWeight="bold">
                          {componentItem.name} (x{componentItem.quantityNeeded})
                        </Text>
                        <Text color="text">{componentItem.description}</Text>
                      </VStack>
                    </HStack>
                  </Box>
                ))
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={handleCraft} mr={3}>
              Craft
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

interface ComponentImageProps {
  imagePath?: string;
  itemName: string;
}

const ComponentImage: React.FC<ComponentImageProps> = ({ imagePath, itemName }) => {
  const [imageUrl, setImageUrl] = useState<string>('placeholder-image.png');
  const [loadingImage, setLoadingImage] = useState<boolean>(true);

  useEffect(() => {
    const fetchImage = async () => {
      if (imagePath) {
        try {
          const url = await getDownloadURL(ref(storage, imagePath));
          setImageUrl(url);
        } catch (error) {
          console.error('Error fetching component image:', error);
        }
      }
      setLoadingImage(false);
    };

    fetchImage();
  }, [imagePath]);

  return loadingImage ? (
    <Box width="50px" height="50px" display="flex" alignItems="center" justifyContent="center">
      <Spinner size="sm" />
    </Box>
  ) : (
    <Image
      src={imageUrl}
      alt={itemName}
      boxSize="50px"
      objectFit="cover"
      borderRadius="md"
    />
  );
};

export default RecipeDetailsModal;
