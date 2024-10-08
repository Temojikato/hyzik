// src/components/InventoryModal.tsx

import React, { useState, useEffect } from 'react';
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
  Grid,
  Input,
  Select,
  HStack,
  Spacer,
  Spinner,
  Image,
} from '@chakra-ui/react';
import { Item, Reyvateil } from '../types/Reyvateils';
import { User } from 'firebase/auth';
import AddItemModal from './AddItemModal';
import ItemDetailsModal from './ItemDetailsModal';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';
import { useToast } from '@chakra-ui/react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../Firebase';
import CraftingModal from './CraftingModal';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: Item[];
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
  currentUser: User | null;
  reyvateil: Reyvateil | null;
  unlockedRecipes: string[];
  setUnlockedRecipes: (recipe: string) => Promise<void>;
}

const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  inventory,
  setInventory,
  currentUser,
  reyvateil,
  unlockedRecipes,
  setUnlockedRecipes,
}) => {
  const {
    isOpen: isAddItemOpen,
    onOpen: onAddItemOpen,
    onClose: onAddItemClose,
  } = useDisclosure();

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const {
    isOpen: isItemDetailsOpen,
    onOpen: onItemDetailsOpen,
    onClose: onItemDetailsClose,
  } = useDisclosure();


  const {
    isOpen: isCraftingOpen,
    onOpen: onCraftingOpen,
    onClose: onCraftingClose,
  } = useDisclosure();

  const [filterText, setFilterText] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const db = getFirestore();

  // Fetch all items when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchAllItems = async () => {
        setLoading(true);
        try {
          const itemsRef = collection(db, 'items');
          const q = query(itemsRef);
          const querySnapshot = await getDocs(q);
          const items: Item[] = [];
          querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            if (data && data.name) {
              items.push({ id: docSnapshot.id, ...data } as Item);
            }
          });
          setAllItems(items);

          // Extract unique categories
          const uniqueCategories = Array.from(
            new Set(items.map((item) => item.category))
          );
          setCategories(['All', ...uniqueCategories]);
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
      // Reset filters when modal is closed
      setFilterText('');
      setFilterCategory('All');
    }
  }, [isOpen, db, toast]);

  // Filtered inventory based on search text and category
  const filteredInventory = inventory.filter((inventoryItem) => {
    const itemData = allItems.find((item) => item.id === inventoryItem.id);
    if (!itemData) return false;

    const matchesText = itemData.name
      .toLowerCase()
      .includes(filterText.toLowerCase());
    const matchesCategory =
      filterCategory === 'All' || itemData.category === filterCategory;

    return matchesText && matchesCategory;
  });


  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent bg="secondary" maxH="80vh">
          <ModalHeader color="textHeader">Your Inventory</ModalHeader>
          <ModalCloseButton color="text" />
          <ModalBody>
            {/* Filter and Add Item Button */}
            <HStack mb={4}>
              <Input
                placeholder="Search..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                bg="white"
              />
              <Select
                placeholder="Filter by Category"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                bg="white"
                maxW="200px"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
              <Spacer />
              <Button onClick={onAddItemOpen} colorScheme="blue">
                Add Item
              </Button>
              <Button fontFamily="hymmnos" colorScheme="green" ml={2} onClick={onCraftingOpen}>Crafting</Button>
            </HStack>

            {/* Inventory Grid */}
            {loading ? (
              <Spinner size="xl" />
            ) : (
              <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={4}>
                {filteredInventory.map((inventoryItem) => {
                  const itemData = allItems.find((item) => item.id === inventoryItem.id);
                  if (!itemData) return null;

                  return (
                    <Box
                      key={inventoryItem.id}
                      bg="accent"
                      borderRadius="md"
                      overflow="hidden"
                      cursor="pointer"
                      onClick={() => {
                        setSelectedItem({ ...itemData, quantity: inventoryItem.quantity });
                        onItemDetailsOpen();
                      }}
                      position="relative"
                    >
                      <ItemImage imagePath={"items/" + itemData.name + ".png"} itemName={itemData.name} />
                      <Box p={2} bg="secondary" textAlign="center">
                        <Text color="text" fontWeight="bold" fontSize="sm">
                          {itemData.name} (x{inventoryItem.quantity})
                        </Text>
                      </Box>
                    </Box>
                  );
                })}
                {filteredInventory.length === 0 && (
                  <Text color="text" textAlign="center" w="100%">
                    No items found.
                  </Text>
                )}
              </Grid>
            )}
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

      {/* Item Details Modal */}
      {selectedItem && (
        <ItemDetailsModal
          isOpen={isItemDetailsOpen}
          onClose={() => {
            onItemDetailsClose();
            setSelectedItem(null);
          }}
          item={selectedItem}
          inventory={inventory}
          setInventory={setInventory}
          currentUser={currentUser}
          unlockedRecipes={unlockedRecipes}
          setUnlockedRecipes={setUnlockedRecipes}
        />
      )}


      <CraftingModal
        isOpen={isCraftingOpen}
        onClose={onCraftingClose}
        unlockedRecipes={unlockedRecipes}
        inventory={inventory}
        setInventory={setInventory}
        currentUser={currentUser}
      />
    </>
  );
};

// Separate component to handle item image fetching
interface ItemImageProps {
  imagePath?: string;
  itemName: string;
}

const ItemImage: React.FC<ItemImageProps> = ({ imagePath, itemName }) => {
  const [imageUrl, setImageUrl] = useState<string>('placeholder-image.png');
  const [loadingImage, setLoadingImage] = useState<boolean>(true);

  useEffect(() => {
    const fetchImage = async () => {
      if (imagePath) {
        try {
          const url = await getDownloadURL(ref(storage, imagePath));
          setImageUrl(url);
        } catch (error) {
          console.error('Error fetching item image:', error);
        }
      }
      setLoadingImage(false);
    };

    fetchImage();
  }, [imagePath]);

  return loadingImage ? (
    <Box height="100px" display="flex" alignItems="center" justifyContent="center">
      <Spinner size="md" />
    </Box>
  ) : (
    <Image
      src={imageUrl}
      alt={itemName}
      objectFit="cover"
      width="100%"
      height="100px"
    />
  );
};

export default InventoryModal;
