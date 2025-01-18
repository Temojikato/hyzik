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
  Image,
  SimpleGrid,
  Flex,
  Select,
  Input,
  Badge,
  useDisclosure
} from '@chakra-ui/react';

import { fetchAllMonstersFromNestedDocs } from '../utils/fetchAllMonsters';
import { MonsterSpecies, MonsterTier, MonsterLore } from '../types/BestiaryTypes';
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
  const [loading, setLoading] = useState(false);

  // Filters
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Secondary modal to view details
  const [selectedMonster, setSelectedMonster] = useState<MonsterSpecies | null>(null);
  const {
    isOpen: isDetailsOpen,
    onOpen: openDetails,
    onClose: closeDetails,
  } = useDisclosure();

  // Fetch all monsters from Firestore when main modal is open
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchAllMonstersFromNestedDocs()
        .then((monsters) => setAllSpecies(monsters))
        .catch((err) => console.error('Error fetching monsters:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  // Filtering logic
  const filteredSpecies = useMemo(() => {
    return allSpecies.filter((monster) => {
      const matchesCategory =
        !selectedCategoryId || monster.categoryId === selectedCategoryId;
      const matchesSearch = monster.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allSpecies, selectedCategoryId, searchTerm]);

  // Category filter handler
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryId(e.target.value);
  };

  // Click on monster card
  const handleSpeciesClick = (species: MonsterSpecies) => {
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
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent bg="gray.900">
        {/* Main "bestiary" screen */}
        <ModalHeader color="purple.300">Bestiary</ModalHeader>
        <ModalCloseButton color="gray.100" />
        <ModalBody>
          {/* Filter UI */}
          <Box p={4} color="gray.100">
            <Flex mb={6} wrap="wrap" gap={4} align="center" justify="center">
              <Select
                placeholder="All Categories"
                value={selectedCategoryId}
                onChange={handleCategoryChange}
                width="200px"
                bg="gray.700"
              >
                {Array.from(new Set(allSpecies.map((m) => m.categoryId))).map(
                  (catId) => (
                    <option key={catId} value={catId}>
                      {catId}
                    </option>
                  )
                )}
              </Select>

              <Input
                placeholder="Search Monsters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                width="300px"
                bg="gray.700"
              />
            </Flex>

            {loading && <Text>Loading bestiary...</Text>}

            {!loading && (
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
                {filteredSpecies.map((species) => {
                  // 1) pick a random unlocked tier name
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
                    >
                      {randomTierName ? (
                        <TierImage
                          tierName={randomTierName}
                        />
                      ) : (
                        <TierImage tierName={''}                        
                        />
                      )}

                      <Box p={3}>
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
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>

      {/* Secondary modal for monster details (Now bigger but not truly full) */}
      <Modal isOpen={isDetailsOpen} onClose={closeDetails} size="6xl" isCentered>
        <ModalOverlay />
        <ModalContent
          bg="gray.800"
          borderRadius="md"
          // Responsive width & height:
          w={{ base: '95vw', md: '80vw', lg: '70vw' }}
          h={{ base: '90vh', md: '80vh' }}
          maxW="none" // So Chakra doesn't constrain it to 500px or so
          maxH="none"
        >
          {/* If monster selected, show TiersSwiper with monster data & reversed tiers */}
          {selectedMonster && (
            <>
              {/* We pass the monster's name and Lore (if it exists) plus the reversed tier array */}
              <TiersSwiper
                monsterName={selectedMonster.name}
                monsterLore={selectedMonster.Lore}
                tiers={tiersArray}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </Modal>
  );
};

function getRandomUnlockedTierName(monster: MonsterSpecies): string | null {
  if (!monster.Tiers) return null;
  // Convert from Record<string, MonsterTier> to an array
  const tiersArray = Object.values(monster.Tiers);

  // Filter out locked ones
  const unlocked = tiersArray.filter(t => !t.Locked);

  if (unlocked.length === 0) {
    // No unlocked tiers => fallback
    return null;
  }

  // Pick a random index
  const randomIndex = Math.floor(Math.random() * unlocked.length);
  return unlocked[randomIndex].Name || null;
}


export default FullScreenBestiaryModal;
