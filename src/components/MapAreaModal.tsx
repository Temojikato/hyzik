// MapAreaModal.tsx
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
  Image,
  BoxProps,
  Box,
} from '@chakra-ui/react';
import { MapArea } from '../mapdata';
import { useNavigate } from 'react-router-dom';

interface MapAreaModalProps {
  area: MapArea;
  isOpen: boolean;
  onClose: () => void;
  onUnlock: (areaId: string) => void; // e.g., to handle unlocking externally
}

const MapAreaModal: React.FC<MapAreaModalProps> = ({ area, isOpen, onClose, onUnlock }) => {
  const navigate = useNavigate();

  // If locked, blur everything below
  const isLocked = area.locked;
  const blurStyle: React.CSSProperties = {
    filter: 'blur(4px)',
    userSelect: 'none',
    pointerEvents: 'none',
  };

  const handleMonsterClick = (monster: string) => {
    if (area.monstersDocumented) {
      // Navigate to bestiary if we have docs
      navigate(`/bestiary/${monster}`);
    } else {
      alert('Monster not documented yet!');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{area.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLocked && (
            <Text color="red.400" fontWeight="bold" mb={2}>
              This area is currently locked!
            </Text>
          )}

          <Box style={isLocked ? blurStyle : undefined}>
            {area.image && (
              <Image src={area.image} alt={area.name} mb={4} />
            )}
            <Text fontWeight="bold" mb={2}>Monsters in this area:</Text>
            {area.monsters && area.monsters.length > 0 ? (
              <>
                {area.monsters.map((monster: string) => (
                  <Text
                    key={monster}
                    color="blue.400"
                    textDecoration="underline"
                    cursor={area.monstersDocumented ? 'pointer' : 'not-allowed'}
                    onClick={() => handleMonsterClick(monster)}
                  >
                    {monster}
                  </Text>
                ))}
              </>
            ) : (
              <Text>No monsters here!</Text>
            )}

            {/* Any other objects or details you want to show */}
          </Box>
        </ModalBody>

        <ModalFooter>
          {isLocked && (
            <Button
              colorScheme="yellow"
              mr={3}
              onClick={() => onUnlock(area.id)}
            >
              Reveal (Unlock)
            </Button>
          )}
          <Button onClick={onClose} colorScheme="blue">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MapAreaModal;
