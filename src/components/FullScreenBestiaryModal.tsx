// src/components/FullScreenBestiaryModal.tsx

import React, { useEffect, useState, useMemo } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Button,
  Text,
  SimpleGrid,
  Flex,
  Input,
  Badge,
  useDisclosure,
  VStack,
  Heading,
  Image,
  Switch
} from '@chakra-ui/react';

import { fetchAllMonstersFromNestedDocs, fetchAllCategories, MonsterCategory } from '../utils/fetchAllMonsters';
import { MonsterSpecies, MonsterTier } from '../types/BestiaryTypes';
import TiersSwiper from './TiersSwiper';
import TierImage from './TierImage';

interface FullScreenBestiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FullScreenBestiaryModal: React.FC<FullScreenBestiaryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [allSpecies, setAllSpecies] = useState<MonsterSpecies[]>([]);
  const [allCategories, setAllCategories] = useState<MonsterCategory[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLocked, setShowLocked] = useState(false);
  // Secondary modal to view details
  const [selectedMonster, setSelectedMonster] = useState<MonsterSpecies | null>(null);
  const {
    isOpen: isDetailsOpen,
    onOpen: openDetails,
    onClose: closeDetails,
  } = useDisclosure();

  // Fetch all categories and monsters from Firestore when modal is open
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Fetch categories first
      fetchAllCategories()
        .then((categories: MonsterCategory[]) => setAllCategories(categories))
        .catch((err: Error) => console.error('Error fetching categories:', err));

      // Fetch all species
      fetchAllMonstersFromNestedDocs()
        .then((monsters) => setAllSpecies(monsters.filter((specie) => {
          return (specie.name != undefined && specie.name != "description")
        })))
        .catch((err) => console.error('Error fetching monsters:', err))
        .finally(() => setLoading(false));
    } else {
      // Reset state when modal is closed
      setSelectedCategoryId(null);
      setSearchTerm('');
      setAllSpecies([]);
      setAllCategories([]);
    }
  }, [isOpen]);

  // Extract unique categories from fetched data (alternative approach)
  /*
  const uniqueCategories = useMemo(() => {
    const categories = Array.from(new Set(allSpecies.map((m) => m.categoryId)));
    return categories.map((catId) => ({
      id: catId,
      name: capitalizeFirstLetter(catId), // Optional: capitalize for display
      description: categoryDescriptions[catId] || 'No description available.',
    }));
  }, [allSpecies, categoryDescriptions]);
  */

  // Filtering logic
  const filteredSpecies = useMemo(() => {
    let filtered = allSpecies;

    if (selectedCategoryId) {
      filtered = filtered.filter((monster) => monster.categoryId === selectedCategoryId);
    }

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter((monster) =>
        monster.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (!showLocked) {
      filtered = filtered.filter((monster) => !monster.locked);
    }

    return filtered;
  }, [allSpecies, selectedCategoryId, searchTerm, showLocked]);

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSearchTerm(''); // Reset search term when changing category
  };

  // Click on monster card
  const handleSpeciesClick = (species: MonsterSpecies) => {
    if (species.locked) {
      return;
    }
    setSelectedMonster(species);
    openDetails();
  };

  // Build an array of tiers (reversed if you want them in reverse order)
  // Also pass the monster's Lore property (if any)
  const tiersArray: MonsterTier[] = useMemo(() => {
    if (!selectedMonster?.Tiers) return [];
    // Convert from Record<string, MonsterTier> to MonsterTier[]
    const baseArray = Object.entries(selectedMonster.Tiers).map(([_, val]) => val);
    // Reverse the order if you want oldest => newest or similar
    return baseArray.reverse();
  }, [selectedMonster]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent bg="gray.900">
          {/* Main "bestiary" screen */}
          <ModalHeader color="purple.300">Bestiary</ModalHeader>
          <ModalCloseButton color="gray.100" />
          <ModalBody>
            {/* Content based on whether a category is selected */}
            {!selectedCategoryId ? (
              // Step 1: Display Categories
              <Box p={4} color="gray.100">
                <Heading size="md" mb={4} textAlign="center">
                  Select a Category
                </Heading>
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
                  {allCategories.map((category) => (
                    <Box
                      key={category.id}
                      bg="gray.800"
                      borderRadius="md"
                      overflow="hidden"
                      p={4}
                      cursor="pointer"
                      transition="transform 0.2s, background-color 0.2s"
                      _hover={{ transform: 'scale(1.05)', bg: 'gray.700' }}
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <VStack spacing={2} align="center">
                        <Heading size="sm">{capitalizeFirstLetter(category.name)}</Heading>
                        <Text fontSize="sm" color="gray.400" textAlign="center">
                          {category.description.substring(0, 100)}
                          {category.description.length > 100 ? '...' : ''}
                        </Text>
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            ) : (
              <Box p={4} color="gray.100">
                <Flex mb={6} align="center" justify="space-between" flexWrap="wrap" gap={4}>
                  <Button onClick={() => setSelectedCategoryId(null)} colorScheme="purple">
                    &larr; Back to Categories
                  </Button>

                  <Flex align="center">
                    <Switch
                      isChecked={showLocked}
                      onChange={(e) => setShowLocked(e.target.checked)} // ADDED
                      colorScheme="purple"
                      mr={2}
                    />
                    <Text color="gray.100">Show locked entries</Text>
                  </Flex>
                  <Input
                    placeholder="Search Monsters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    width={{ base: '100%', md: '300px' }}
                    bg="gray.700"
                  />
                </Flex>

                {/* Category Description */}
                <Box mb={6} bg="gray.800" p={4} borderRadius="md">
                  <Heading size="md" mb={2}>
                    {capitalizeFirstLetter(
                      allCategories.find((cat) => cat.id === selectedCategoryId)?.name || selectedCategoryId
                    )}
                  </Heading>
                  <Text>
                    {
                      allCategories.find((cat) => cat.id === selectedCategoryId)?.description ||
                      'No description available.'
                    }
                  </Text>
                </Box>

                {loading ? (
                  <Text>Loading bestiary...</Text>
                ) : (
                  <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
                    {filteredSpecies.map((species) => {
                      const randomTierName = getRandomUnlockedTierName(species);

                      return (
                        <Box
                          key={`${species.categoryId}-${species.name}`}
                          bg="gray.800"
                          borderRadius="md"
                          overflow="hidden"
                          transition="transform 0.2s"
                          _hover={{ transform: 'scale(1.03)', cursor: 'pointer' }}
                          onClick={() => handleSpeciesClick(species)}
                          /* Center the contents */
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {/* Centered TierImage */}
                          {randomTierName ? (
                            <TierImage tierName={randomTierName} show={!species.locked} />
                          ) : (
                            <TierImage tierName={''} />
                          )}

                          {/* Centered Text */}
                          <Box p={3} textAlign="center">
                            <Text fontSize="lg" fontWeight="bold" mb={1} color="purple.300">
                              {species.name}
                            </Text>
                            {species.locked && <Badge colorScheme="red">Monster Locked</Badge>}
                          </Box>
                        </Box>
                      );
                    })}
                  </SimpleGrid>

                )}
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Secondary modal for monster details */}
      <Modal isOpen={isDetailsOpen} onClose={closeDetails} size="full" isCentered scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent
          bg="gray.800"
          borderRadius="md"
          w={{ base: '95vw', md: '80vw', lg: '70vw' }}
          h={{ base: '90vh', md: '80vh' }}
          maxW="none"
          maxH="none"
        >
          {selectedMonster && (
            <>
              <ModalHeader color="purple.300">{selectedMonster.name}</ModalHeader>
              <ModalCloseButton color="gray.100" />
              <ModalBody>
                <TiersSwiper
                  monsterName={selectedMonster.name}
                  monsterLore={selectedMonster.Lore}
                  loreLocked={selectedMonster.loreLocked!!}
                  tiers={tiersArray}
                />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" onClick={closeDetails}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>)
}

// Utility Functions

function getRandomUnlockedTierName(monster: MonsterSpecies): string | null {
  if (!monster.Tiers) return null;
  // Convert from Record<string, MonsterTier> to MonsterTier[]
  const tiersArray = Object.values(monster.Tiers);

  // Filter out locked ones
  const unlocked = tiersArray.filter((t) => !t.Locked);

  if (unlocked.length === 0) {
    // No unlocked tiers => fallback
    return null;
  }

  // Pick a random index
  return unlocked[unlocked.length - 1].Name || null;
}

function capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default FullScreenBestiaryModal;
