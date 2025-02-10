// src/components/CraftingModal.tsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Grid,
  Text,
  Image,
  Box,
  useDisclosure,
  Spinner,
  Input,
  Select,
  HStack,
  Spacer,
  VStack,
  ModalFooter,
} from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { Item } from '../types/Reyvateils';
import RecipeDetailsModal from './RecipeDetailsModal';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useToast } from '@chakra-ui/react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../Firebase';

interface CraftingModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedRecipes: string[];
  inventory: Item[];
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
  currentUser: User | null;
}

const CraftingModal: React.FC<CraftingModalProps> = ({
  isOpen,
  onClose,
  unlockedRecipes,
  inventory,
  setInventory,
  currentUser,
}) => {
  const [recipes, setRecipes] = useState<Item[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Item | null>(null);
  const {
    isOpen: isRecipeDetailsOpen,
    onOpen: onRecipeDetailsOpen,
    onClose: onRecipeDetailsClose,
  } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const db = getFirestore();

  const [filterText, setFilterText] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch unlocked recipes when modal opens
  useEffect(() => {
    if (isOpen && currentUser) {
      const fetchRecipes = async () => {
        setLoading(true);
        try {
          const itemsRef = collection(db, 'items');

          // Handle Firestore 'in' query limitations
          const batches = [];
          const batchSize = 10;
          for (let i = 0; i < unlockedRecipes.length; i += batchSize) {
            const batch = unlockedRecipes.slice(i, i + batchSize);
            const q = query(itemsRef, where('name', 'in', batch));
            batches.push(getDocs(q));
          }

          const results = await Promise.all(batches);
          const fetchedRecipes: Item[] = [];
          results.forEach((querySnapshot) => {
            querySnapshot.forEach((docSnapshot) => {
              const data = docSnapshot.data();
              fetchedRecipes.push({
                ...data,
                id: docSnapshot.id,
              } as Item);
            });
          });

          setRecipes(fetchedRecipes);

          // Extract unique categories
          const uniqueCategories = Array.from(
            new Set(fetchedRecipes.map((recipe) => recipe.category))
          );
          setCategories(['All', ...uniqueCategories]);
        } catch (error) {
          console.error('Error fetching recipes:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch recipes. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      };
      fetchRecipes();
    } else {
      setRecipes([]);
    }
  }, [isOpen, currentUser, unlockedRecipes, db, toast]);

  // Filtered recipes based on search text and category
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesText = recipe.name.toLowerCase().includes(filterText.toLowerCase());
    const matchesCategory =
      filterCategory === 'All' || recipe.category === filterCategory;
    return matchesText && matchesCategory;
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered scrollBehavior="inside">
        {/* By setting ModalContent to use flex column layout and a max height, 
            we ensure that ModalBody can expand and scroll as needed */}
        <ModalOverlay />
        <ModalContent bg="secondary" maxH="80vh" display="flex" flexDirection="column">
          <ModalHeader color="textHeader">Crafting</ModalHeader>
          <ModalCloseButton color="text" />
          <ModalBody overflowY="auto" flex="1">
            {/* Filter controls */}
            <VStack mb={4} spacing={4} align="stretch">
              <HStack>
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
              </HStack>
            </VStack>

            {/* Recipes Grid */}
            {loading ? (
              <Spinner size="xl" />
            ) : (
              <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={4}>
                {filteredRecipes.map((recipe) => (
                  <Box
                    key={recipe.id}
                    bg="accent"
                    borderRadius="md"
                    overflow="hidden"
                    cursor="pointer"
                    onClick={() => {
                      setSelectedRecipe(recipe);
                      onRecipeDetailsOpen();
                    }}
                    position="relative"
                  >
                    <ItemImage imagePath={"items/" + recipe.name + ".png"} itemName={recipe.name} />

                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      bg="rgba(0, 0, 0, 0.6)"
                      color="white"
                      px={2}
                      py={1}
                      borderBottomRightRadius="md"
                    >
                      Recipe
                    </Box>
                    <Box p={2} bg="secondary" textAlign="center">
                      <Text color="text" fontWeight="bold" fontSize="sm">
                        {recipe.name}
                      </Text>
                    </Box>
                  </Box>
                ))}
                {filteredRecipes.length === 0 && (
                  <Text color="text" textAlign="center" w="100%">
                    No recipes found.
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

      {/* Recipe Details Modal */}
      {selectedRecipe && (
        <RecipeDetailsModal
          isOpen={isRecipeDetailsOpen}
          onClose={() => {
            onRecipeDetailsClose();
            setSelectedRecipe(null);
          }}
          recipe={selectedRecipe}
          inventory={inventory}
          setInventory={setInventory}
          currentUser={currentUser}
        />
      )}
    </>
  );
};


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

export default CraftingModal;
