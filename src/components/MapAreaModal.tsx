// src/components/MapAreaModal.tsx
import React from 'react';
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
} from '@chakra-ui/react';
import { MapArea, MapFloor } from '../mapdata';
import InteractiveMapArea from './InteractiveMapArea';

interface MapAreaModalProps {
  area: MapArea;
  floor: MapFloor;
  isOpen: boolean;
  onClose: () => void;
  floorImageUrl: string;
}

const MapAreaModal: React.FC<MapAreaModalProps> = ({
  area,
  floor,
  isOpen,
  onClose,
  floorImageUrl,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
      <ModalOverlay />
      <ModalContent mt="2rem" maxHeight="90vh">
        <ModalHeader>{area.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0}>
          <Flex direction="column" height="70vh">
            {/* Top: the pinch/zoom map container */}
            <Box flex="1" position="relative" overflow="hidden">
              <InteractiveMapArea
                imageUrl={floorImageUrl}
                area={area}
                // This triggers the bounding box auto-centering:
                autoFocusArea={true}
                desiredScale={2}
              />
            </Box>

            {/* Bottom: textual info */}
            <Box
              flex="1"
              p={4}
              bg="gray.50"
              overflowY="auto"
            >
              <Text fontWeight="bold" fontSize="lg" mb={2}>
                Area Details
              </Text>
              <Text fontWeight="semibold">Description:</Text>
              <Text mb={3}>{area.description || 'No description.'}</Text>

              {area.monsters.length > 0 && (
                <Box mb={3}>
                  <Text fontWeight="semibold">Monsters:</Text>
                  <Text>{area.monsters.join(', ')}</Text>
                </Box>
              )}
              {/* ... more fields if needed */}
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
  );
};

export default MapAreaModal;
