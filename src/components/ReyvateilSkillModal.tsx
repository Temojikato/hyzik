// src/components/ReyvateilSkillModal.tsx

import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  Image,
  ModalFooter,
} from '@chakra-ui/react';
import { Ability } from '../types/Reyvateils';

interface ReyvateilSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  ability: Ability;
  isCooldownActive: boolean;
  remainingTime: number;
  onUseAbility: () => void;
}

const ReyvateilSkillModal: React.FC<ReyvateilSkillModalProps> = ({
  isOpen,
  onClose,
  ability,
  isCooldownActive,
  remainingTime,
  onUseAbility,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent bg="black" color="white">
        <ModalHeader>{ability.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="center">
            <Image
              src={ability.icon || 'https://via.placeholder.com/100'}
              alt={ability.name}
              boxSize="100px"
              objectFit="cover"
              filter={isCooldownActive ? 'grayscale(100%) opacity(0.5)' : 'none'}
            />
            <Text textAlign="center">{ability.description}</Text>
            <Text fontWeight="bold">Cooldown: {ability.cooldown} seconds</Text>
            <Button
              onClick={onUseAbility}
              colorScheme="blue"
              isDisabled={isCooldownActive}
              opacity={isCooldownActive ? 0.6 : 1}
            >
              {isCooldownActive ? `Cooldown (${remainingTime}s)` : 'Use'}
            </Button>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} colorScheme="gray">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReyvateilSkillModal;
