// src/components/FullScreenNPCModal.tsx
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
  VStack,
  Heading,
  Image,
  useDisclosure,
  HStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { fetchAllNPCs } from '../utils/fetchAllNPCs';
import { NPC } from '../types/ResidentCodexTypes';
import { useToast } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import NPCImage from './NPCImage';
import FullScreenImageGallery from './FullScreenImageGallery';

type CategoryMode = 'workplace' | 'families' | 'faction';
const categoryModes: CategoryMode[] = ['workplace', 'families', 'faction'];

const FullScreenNPCModal: React.FC<{ isOpen: boolean; onClose: () => void; currentUser: any }> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [allNPCs, setAllNPCs] = useState<NPC[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<CategoryMode>('workplace');
  // When a specific category value is selected (e.g. "Thistlefoot")
  const [selectedCategoryValue, setSelectedCategoryValue] = useState<string | null>(null);
  const toast = useToast();

  // For NPC detail modal
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
  const { isOpen: isDetailsOpen, onOpen: openDetails, onClose: closeDetails } = useDisclosure();

  // For zero-UI fullscreen gallery
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  function openGallery(index: number) {
    setGalleryIndex(index);
    setIsGalleryOpen(true);
  }
  function closeGallery() {
    setIsGalleryOpen(false);
  }


  // Fetch NPC data when modal opens
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchAllNPCs()
        .then((data) => setAllNPCs(data))
        .catch((err) => {
          console.error('Error fetching NPC data:', err);
          toast({
            title: 'Error',
            description: 'Failed to fetch NPC data.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        })
        .finally(() => setLoading(false));
    } else {
      setAllNPCs([]);
      setSearchTerm('');
      setSelectedCategoryValue(null);
    }
  }, [isOpen, toast]);

  // Cycle between category modes
  const cycleViewMode = () => {
    const currentIndex = categoryModes.indexOf(viewMode);
    const nextIndex = (currentIndex + 1) % categoryModes.length;
    setViewMode(categoryModes[nextIndex]);
    setSelectedCategoryValue(null); // Reset when mode changes
  };

  // Extract unique category values for the current mode
  const uniqueCategoryValues = useMemo(() => {
    const values = allNPCs.flatMap((npc) =>
      npc.categories && npc.categories[viewMode] ? npc.categories[viewMode] : []
    ).sort((a, b) => {
      const nameA = a.toLowerCase().replace(/^the\s+/, '');
      const nameB = b.toLowerCase().replace(/^the\s+/, '');
      return nameA.localeCompare(nameB);
    });
    return Array.from(new Set(values));
  }, [allNPCs, viewMode]);
  // Filter logic
  const filteredNPCs = useMemo(() => {
    // 1) If searching by name, ignore category filters
    if (searchTerm.trim() !== '') {
      return allNPCs.filter((npc) =>
        npc.basicInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // 2) If no search but a category is selected
    else if (selectedCategoryValue) {
      return allNPCs.filter((npc) => {
        const inCategory = npc.categories?.[viewMode]?.includes(selectedCategoryValue);
        const lockedForCategory = npc.categoryLocks?.[viewMode] === true;
        return inCategory && !lockedForCategory;
      });
    }
    // 3) Otherwise, no search & no category → return empty array
    return [];
  }, [allNPCs, searchTerm, selectedCategoryValue, viewMode]);


  // Handle NPC card click to open details modal
  const handleNPCCardClick = (npc: NPC) => {
    setSelectedNPC(npc);
    openDetails();
  };

  const renderNPCDetails = (npc: NPC) => {
    return (
      <Box p={4} color="gray.100" width="100%">
        {/* Top row: Image (fixed width) + Basic Info (flexible) */}
        <Flex direction="row" align="flex-start" wrap="nowrap" mb={4}>
          {/* Image Column */}
          <Box
            width="200px"    // You can tweak this width
            flexShrink={0}
            mr={4}
            cursor="pointer"
            onClick={() => openGallery(0)} // Always open gallery at first image
          >
            {npc.imageFiles && npc.imageFiles.length > 0 ? (
              <Box>
                <Swiper spaceBetween={10} slidesPerView={1} style={{ width: '100%', height: 'auto' }}>
                  {npc.imageFiles.map((filename, index) => (
                    <SwiperSlide key={index}>
                      <NPCImage
                        npcName={npc.basicInfo.name}
                        imageFiles={npc.imageFiles || []}
                        locked={npc.locked || false}
                        boxSize="100%"
                        currentIndex={index}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <Text fontSize="xs" color="gray.400" mt={1} textAlign="center">
                  Click image to view gallery
                </Text>
              </Box>
            ) : (
              <Box>
                <Image
                  src={npc.imageUrl}
                  alt={npc.basicInfo.name}
                  width="100%"
                  objectFit="contain"
                />
                <Text fontSize="xs" color="gray.400" mt={1} textAlign="center">
                  Click image to view gallery
                </Text>
              </Box>
            )}
          </Box>

          {/* Basic Info Column */}
          <Box flex="1" minW="0">
            <VStack align="start" spacing={3} mb={4}>
              <Box>
                <Text fontSize="sm" fontWeight="bold" color="gray.400">
                  Age
                </Text>
                <Text>{npc.basicInfo.age}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="bold" color="gray.400">
                  Residence
                </Text>
                <Text>{npc.basicInfo.residence}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="bold" color="gray.400">
                  Workplace
                </Text>
                <Text>{npc.basicInfo.workplace}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="bold" color="gray.400">
                  Family
                </Text>
                <Text>{npc.basicInfo.family.join(', ')}</Text>
              </Box>
            </VStack>
          </Box>
        </Flex>

        {/* Lore Sections below */}
        {npc.lore && (
          <Box>
            {Object.entries(npc.lore).map(([key, field]) => (
              <Box key={key} mb={4} p={3} bg="gray.700" borderRadius="md">
                <Heading size="sm" mb={2} textTransform="capitalize">
                  {field.title}
                </Heading>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                  {Object.entries(field)
                    .filter(([k]) => k.startsWith('level'))
                    .sort(
                      (a, b) =>
                        parseInt(a[0].replace('level', '')) -
                        parseInt(b[0].replace('level', ''))
                    )
                    .map(([level, text], index) => {
                      const levelNumber = index + 1;
                      const isLocked = levelNumber > field.unlockedtier;
                      return (
                        <Box
                          key={level}
                          p={2}
                          border="1px solid"
                          borderColor="gray.600"
                          borderRadius="md"
                          bg="transparent"
                          filter={isLocked ? 'blur(4px)' : 'none'}
                        >
                          <Text>{text as string}</Text>
                        </Box>
                      );
                    })}
                </SimpleGrid>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  };


  // Render category badges for NPC card header
  const renderCategoryInfo = (npc: NPC) => {
    if (!npc.categories) return null;
    const badges: JSX.Element[] = [];
    (Object.entries(npc.categories) as [keyof NPC['categories'], string[]][]).forEach(([catKey, values]) => {
      // Skip if the category is locked
      if (npc.categoryLocks && npc.categoryLocks[catKey] === true) return;
      // Choose color based on category key
      let colorScheme = 'purple';
      if (catKey === 'families') colorScheme = 'blue';
      else if (catKey === 'workplace') colorScheme = 'green';
      else if (catKey === 'faction') colorScheme = 'red';
      values.forEach((value) => {
        badges.push(
          <WrapItem key={`${catKey}-${value}`}>
            <Box as="span" mr={2}>
              <Text fontSize="sm" color={colorScheme + ".400"}>
                {value}
              </Text>
            </Box>
          </WrapItem>
        );
      });
    });
    if (badges.length === 0) return null;
    return <Wrap spacing="8px">{badges}</Wrap>;
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent bg="gray.900" overflowY="auto">
          <ModalHeader color="purple.300">
            Resident Codex
            <Button size="sm" ml={4} onClick={cycleViewMode}>
              Category: {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
            </Button>
          </ModalHeader>
          <ModalCloseButton color="gray.100" />
          <ModalBody>
            <Box p={4} color="gray.100">
              {/* Always show the search bar */}
              <Input
                placeholder="Search NPCs by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                width={{ base: '100%', md: '300px' }}
                bg="gray.700"
                mb={4}
              />

              {/* Show category buttons only when search term is empty */}
              {searchTerm.trim() === '' && selectedCategoryValue === null && (
                <Box>
                  <Heading size="md" mb={4} textAlign="center">
                    Select a {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Category
                  </Heading>
                  <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
                    {uniqueCategoryValues.map((value) => (
                      <Button key={value} colorScheme="purple" onClick={() => setSelectedCategoryValue(value)}>
                        {value}
                      </Button>
                    ))}
                  </SimpleGrid>
                </Box>
              )}

              {searchTerm.trim() === '' && selectedCategoryValue !== null && (
                <Button
                  onClick={() => setSelectedCategoryValue(null)}
                  colorScheme="purple"
                  mb={6}
                >
                  &larr; Back to Categories
                </Button>
              )}
              {/* Show NPC grid */}
              {(searchTerm.trim() !== '' || selectedCategoryValue) && (
                <>
                  {loading ? (
                    <Text>Loading Resident Codex...</Text>
                  ) : filteredNPCs.length === 0 ? (
                    <Text>No NPCs found.</Text>
                  ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      {filteredNPCs.map((npc) => (
                        <Box
                          key={npc.id}
                          p={4}
                          bg="gray.800"
                          borderRadius="md"
                          transition="transform 0.2s"
                          _hover={{ transform: 'scale(1.03)', cursor: 'pointer' }}
                          onClick={() => handleNPCCardClick(npc)}
                        >
                          <Flex align="center">
                            <Box flex="none" mr={6}>
                              {npc.imageFiles && npc.imageFiles.length > 0 ? (
                                <NPCImage
                                  npcName={npc.basicInfo.name}
                                  imageFiles={npc.imageFiles || []}
                                  locked={npc.locked || false}
                                  boxSize="80px"
                                  currentIndex={0}
                                />
                              ) : (
                                <Image
                                  src={npc.imageUrl}
                                  alt={npc.basicInfo.name}
                                  maxW="80px"
                                  borderRadius="full"
                                  mr={6}
                                />
                              )}
                            </Box>
                            <Box>
                              <Heading size="md" color="purple.300">
                                {npc.basicInfo.name}
                              </Heading>
                              <VStack align="start" spacing={1}>
                                <Text fontSize="sm" color="gray.400">
                                  Age: {npc.basicInfo.age}
                                </Text>
                                <Text fontSize="sm" color="gray.400">
                                  Residence: {npc.basicInfo.residence}
                                </Text>
                                {renderCategoryInfo(npc)}
                              </VStack>
                            </Box>
                          </Flex>
                        </Box>
                      ))}
                    </SimpleGrid>
                  )}
                </>
              )}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* NPC Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={closeDetails} size="xl" isCentered scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent bg="gray.900" borderRadius="md" maxW="600px">
          {selectedNPC && (
            <>
              <ModalHeader color="purple.300">{selectedNPC.basicInfo.name}</ModalHeader>
              <ModalCloseButton color="gray.100" />
              <ModalBody>
                {renderNPCDetails(selectedNPC)}
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

      {/* Zero-UI Fullscreen Gallery */}
      {selectedNPC && (
        <FullScreenImageGallery
          isOpen={isGalleryOpen}
          onClose={closeGallery}
          npcName={selectedNPC.basicInfo.name}
          imageFiles={selectedNPC.imageFiles || []}
          initialIndex={galleryIndex}
          locked={selectedNPC.locked || false}
        />
      )}
    </>
  );
};

export default FullScreenNPCModal;
