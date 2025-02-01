// src/components/MapAreaModal.tsx

import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Text,
  Flex,
  SimpleGrid,
  Input,
  Switch,
  Heading,
  VStack,
  Badge,
} from '@chakra-ui/react';
import { MapArea, MapFloor, MapRegion } from '../mapdata';
import InteractiveMapArea from './InteractiveMapArea';
import RegionModal from './RegionModal';
import { useDisclosure } from '@chakra-ui/react';
import { getMonsterByName } from '../utils/fetchAllMonsters';
import TierSwiper from './TiersSwiper';
import { MonsterSpecies } from '../types/BestiaryTypes';
import TiersSwiper from './TiersSwiper';
import { User } from 'firebase/auth';
import { Item } from '../types/Reyvateils';

interface MapAreaModalProps {
  area: MapArea;
  floor: MapFloor;
  isOpen: boolean;
  onClose: () => void;
  floorImageUrl: string;
  inventory: Item[];
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
  currentUser: User | null;
}

const MapAreaModal: React.FC<MapAreaModalProps> = ({
  area,
  floor,
  isOpen,
  onClose,
  floorImageUrl,
  inventory,
  setInventory,
  currentUser
}) => {
  // For handling region clicks (opens the RegionModal)
  const [selectedRegion, setSelectedRegion] = useState<MapRegion | null>(null);
  const [regionModalOpen, setRegionModalOpen] = useState(false);
  const handleRegionClick = (region: MapRegion) => {
    setSelectedRegion(region);
    setRegionModalOpen(true);
  };
  const closeRegionModal = () => {
    setRegionModalOpen(false);
    setSelectedRegion(null);
  };

  // For handling monster clicks from the area monsters grid.
  const [selectedMonster, setSelectedMonster] = useState<MonsterSpecies | null>(null);
  const {
    isOpen: isMonsterModalOpen,
    onOpen: openMonsterModal,
    onClose: closeMonsterModal,
  } = useDisclosure();

  async function handleAreaMonsterClick(monsterName: string) {
    const monster = await getMonsterByName(monsterName);
    if (monster) {
      setSelectedMonster(monster);
      openMonsterModal();
    }
  }

  // Blur styles:
  const infoBlurStyle = area.locked ? { filter: 'blur(8px)' } : {};
  const monstersBlurStyle = (!area.monstersDocumented && !area.locked)
    ? { filter: 'blur(8px)' }
    : {};
  const regionsBlurStyle = area.locked ? { filter: 'blur(8px)' } : {};

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
        <ModalOverlay />
        <ModalContent mt="2rem" maxHeight="90vh">
          <ModalHeader>{area.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0}>
            <Flex direction="column" height="70vh">
              {/* TOP: Interactive Map */}
              <Box flex="1" position="relative" overflow="hidden">
                <InteractiveMapArea
                  imageUrl={floorImageUrl}
                  area={area}
                  onRegionClick={handleRegionClick}
                  autoFocusArea={true}
                  desiredScale={2}
                />
                {selectedRegion && (
                  <RegionModal
                    region={selectedRegion}
                    area={area}
                    floor={floor}
                    floorImageUrl={floorImageUrl}
                    isOpen={regionModalOpen}
                    onClose={closeRegionModal}
                    currentUser={currentUser}
                    inventory={inventory}
                    setInventory={setInventory}
                  />
                )}
              </Box>

              {/* BOTTOM: Textual Info */}
              <Box flex="1" p={4} bg="gray.50" overflowY="auto">
                <Text fontWeight="bold" fontSize="lg" mb={2}>
                  Area Details
                </Text>
                {/* Description */}
                <Box mb={3} {...infoBlurStyle}>
                  <Text fontWeight="semibold">Description:</Text>
                  <Text>{area.description || 'No description available.'}</Text>
                </Box>

                {/* Monsters Grid */}
                {area.monsters && area.monsters.length > 0 && (
                  <Box mb={3}>
                    <Text fontWeight="semibold" mb={1}>
                      Monsters:
                    </Text>
                    <SimpleGrid columns={{ base: 2, md: 3 }} gap={2}>
                      {area.monsters.map((mName) => (
                        <Box
                          key={mName}
                          p={2}
                          bg="accent"
                          borderRadius="md"
                          border="1px solid"
                          borderColor="gray.200"
                          cursor="pointer"
                          onClick={() => handleAreaMonsterClick(mName)}
                        >
                          <Text fontWeight="medium">{mName}</Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}

                {/* Regions Grid */}
                {area.regions && area.regions.length > 0 && (
                  <Box mb={3}>
                    <Text fontWeight="semibold" mb={1}>
                      Regions:
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2} {...regionsBlurStyle}>
                      {area.regions.map((regionItem) => (
                        <Box
                          key={regionItem.id}
                          p={2}
                          bg="gray.200"
                          borderRadius="md"
                          cursor="pointer"
                          onClick={() => handleRegionClick(regionItem)}
                        >
                          <Text>{regionItem.name}</Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Nested Modal for Monster Details (TierSwiper) */}
      {selectedMonster && (
        <Modal
          isOpen={isMonsterModalOpen}
          onClose={closeMonsterModal}
          size="full"
          isCentered
          scrollBehavior="inside"
        >
          <ModalOverlay />
          <ModalContent bg="gray.800" borderRadius="md">
            <ModalHeader color="purple.300">{selectedMonster.name}</ModalHeader>
            <ModalCloseButton color="gray.100" />
            <ModalBody>
              <TiersSwiper
                monster={selectedMonster}
                loreLocked={!!selectedMonster.loreLocked}
                tiers={
                  selectedMonster.Tiers
                    ? Object.values(selectedMonster.Tiers).reverse()
                    : []
                }
                inventory={inventory}
                setInventory={setInventory}
                currentUser={currentUser}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={closeMonsterModal}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default MapAreaModal;
