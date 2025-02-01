// src/components/RegionModal.tsx

import React, { useEffect, useRef, useState } from 'react';
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
  IconButton,
  Tooltip,
  useMediaQuery,
  SimpleGrid,
  Badge,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { FaExpand, FaCompress, FaPlus, FaMinus, FaUndo } from 'react-icons/fa';
import { MapRegion, MapArea, MapFloor } from '../mapdata';
import TierSwiper from './TiersSwiper'; // Your existing TierSwiper component
import { MonsterSpecies, MonsterTier } from '../types/BestiaryTypes';
import TiersSwiper from './TiersSwiper';
import { getMonsterByName } from '../utils/fetchAllMonsters';
import { User } from 'firebase/auth';
import { Item } from '../types/Reyvateils';

interface RegionModalProps {
  region: MapRegion;
  area: MapArea;
  floor: MapFloor;
  isOpen: boolean;
  onClose: () => void;
  inventory: Item[];
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
  currentUser: User | null;
  /**
   * Reuse the same floorImageUrl from the area modal 
   * so no second fetch is needed.
   */
  floorImageUrl: string;
}

const RegionModal: React.FC<RegionModalProps> = ({
  region,
  area,
  floor,
  isOpen,
  onClose,
  floorImageUrl,
  inventory,
  setInventory,
  currentUser
}) => {
  // State and refs for interactive image (same as your working code)
  const [isFullscreen, setIsFullscreen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  

  // Track natural dimensions of the floor image.
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const img = new Image();
    img.src = floorImageUrl;
    img.onload = () => {
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
  }, [floorImageUrl]);

  // Auto-focus the region polygon after the modal opens.
  useEffect(() => {
    if (isOpen && dimensions.width && dimensions.height) {
      setTimeout(() => {
        focusOnPolygon(region.polygon);
      }, 200);
    }
  }, [isOpen, dimensions, region.polygon]);

  // --- The original, working focusOnPolygon function ---
  function focusOnPolygon(polygon: [number, number][]) {
    if (!transformRef.current || !wrapperRef.current || !imageRef.current) return;

    // Get rendered image dimensions.
    const renderedImgWidth = imageRef.current.clientWidth;
    const renderedImgHeight = imageRef.current.clientHeight;
    // Calculate shrink factors to convert natural coordinates to rendered coordinates.
    const shrinkFactorX = renderedImgWidth / dimensions.width;
    const shrinkFactorY = renderedImgHeight / dimensions.height;

    // Scale each coordinate in the region polygon.
    const scaledPolygon = polygon.map(([x, y]) => [x * shrinkFactorX, y * shrinkFactorY] as [number, number]);

    const xs = scaledPolygon.map(pt => pt[0]);
    const ys = scaledPolygon.map(pt => pt[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const widthBBox = maxX - minX;
    const heightBBox = maxY - minY;
    const centerX = minX + widthBBox / 2;
    const centerY = minY + heightBBox / 2;

    const containerWidth = wrapperRef.current.offsetWidth;
    const containerHeight = wrapperRef.current.offsetHeight;

    // Calculate scale to fit about 80% of the container.
    const scale = Math.min(containerWidth / widthBBox, containerHeight / heightBBox) * 0.8;
    const translateX = (containerWidth / 2) - (centerX * scale);
    const translateY = (containerHeight / 2) - (centerY * scale);

    transformRef.current.setTransform(translateX, translateY, scale, 300);
  }

  function toggleFullscreen() {
    if (!isFullscreen && wrapperRef.current) {
      wrapperRef.current.requestFullscreen().catch(err => {
        console.error('Error enabling fullscreen in region modal:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  useEffect(() => {
    const handleFSChange = () => {
      const fsElem = document.fullscreenElement;
      setIsFullscreen(!!fsElem && fsElem === wrapperRef.current);
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFSChange);
    };
  }, []);

  const handleZoomIn = () => transformRef.current?.zoomIn();
  const handleZoomOut = () => transformRef.current?.zoomOut();
  const handleReset = () => transformRef.current?.resetTransform();

  // Determine blur styles:
  // If region.locked is true, blur the entire info panel.
  // Otherwise, if monstersDocumented is false, blur only the monsters list.
  const infoBlurStyle = region.locked ? { filter: 'blur(8px)' } : {};
  const monstersBlurStyle = (!region.monstersDocumented && !region.locked)
    ? { filter: 'blur(8px)' }
    : {};

  // --- New: State for handling monster clicks inside the region ---
  const [selectedMonster, setSelectedMonster] = useState<MonsterSpecies | null>(null);
  const {
    isOpen: isMonsterModalOpen,
    onOpen: openMonsterModal,
    onClose: closeMonsterModal,
  } = useDisclosure();

  async function handleMonsterClick(monsterName: string) {
    const monster = await getMonsterByName(monsterName);
    if (monster) {
      setSelectedMonster(monster);
      openMonsterModal();
    } else {
      // Optionally display a message if the monster wasn't found.
      console.error(`Monster with name "${monsterName}" not found.`);
    }
  }
  

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{region.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0}>
            <Flex direction="column" height="100%">
              {/* Top Section: Interactive Map */}
              <Box flex="2" position="relative" overflow="hidden" ref={wrapperRef}>
                {isMobile && (
                  <Tooltip label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
                    <IconButton
                      icon={isFullscreen ? <FaCompress /> : <FaExpand />}
                      onClick={toggleFullscreen}
                      position="absolute"
                      top="10px"
                      right="10px"
                      zIndex={1000}
                      aria-label="Toggle Fullscreen"
                    />
                  </Tooltip>
                )}
                {isMobile && isFullscreen && (
                  <Box
                    position="absolute"
                    bottom="10px"
                    right="10px"
                    zIndex={1000}
                    display="flex"
                    flexDirection="column"
                    gap="10px"
                  >
                    <IconButton icon={<FaPlus />} aria-label="Zoom In" onClick={handleZoomIn} />
                    <IconButton icon={<FaMinus />} aria-label="Zoom Out" onClick={handleZoomOut} />
                    <IconButton icon={<FaUndo />} aria-label="Reset Zoom" onClick={handleReset} />
                  </Box>
                )}
                <TransformWrapper
                  ref={transformRef}
                  initialScale={1}
                  minScale={0.5}
                  maxScale={10}
                  doubleClick={{ disabled: true }}
                  wheel={{ step: 0.1 }}
                  pinch={{ step: 0.1 }}
                >
                  <TransformComponent>
                    <Box position="relative" width="100%" height="100%">
                      <Box
                        as="img"
                        ref={imageRef}
                        src={floorImageUrl}
                        alt={`Floor containing region: ${region.name}`}
                        width="100%"
                        height="100%"
                        objectFit="contain"
                        display="block"
                      />
                      {/* Optionally, you could overlay additional graphics here */}
                    </Box>
                  </TransformComponent>
                </TransformWrapper>
              </Box>

              {/* Bottom Section: Region Information */}
              <Box flex="1" p={4} bg="gray.50" overflowY="auto" {...infoBlurStyle}>
                <Text fontWeight="bold" fontSize="lg" mb={2}>
                  Region Details
                </Text>
                <Text fontWeight="semibold" mb={1}>
                  Description:
                </Text>
                <Text mb={3}>
                  {region.description || 'No description available.'}
                </Text>
                <Text fontWeight="semibold" mb={1}>
                  Monsters (in region):
                </Text>
                <Text mb={3}>
                  {region.monsters && region.monsters.length > 0 && region.monstersDocumented
                    ? region.monsters.join(', ')
                    : 'No monsters documented.'}
                </Text>
                {/* NEW: Render monster cards from the region */}
                {region.monsters && region.monsters.length > 0 && (
                  <Box mt={4}>
                    <Text fontWeight="bold" mb={2}>
                      Tap a monster to view details:
                    </Text>
                    <SimpleGrid columns={{ base: 2, md: 3 }} gap={2}>
                      {region.monsters.map((mName) => (
                        <Box
                          key={mName}
                          p={2}
                          bg="accent"
                          borderRadius="md"
                          border="1px solid"
                          borderColor="gray.200"
                          cursor="pointer"
                          onClick={() => handleMonsterClick(mName)}
                        >
                          <Text fontWeight="medium">{mName}</Text>
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
                tiers={selectedMonster.Tiers ? Object.values(selectedMonster.Tiers).reverse() : []}
                inventory={inventory}
                currentUser={currentUser}
                setInventory={setInventory}
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

export default RegionModal;
