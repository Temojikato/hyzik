// src/components/ReyvateilSkillModal.tsx

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
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { Ability, Reyvateil } from '../types/Reyvateils';

interface ReyvateilSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  ability: Ability;
}

const ReyvateilSkillModal: React.FC<ReyvateilSkillModalProps> = ({ isOpen, onClose, ability }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{ability.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{ability.description}</Text>
          <Text mt={2}>
            Cooldown: {(ability.cooldown || 99999) > 0 ? `${ability.cooldown} seconds` : 'None'}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReyvateilSkillModal;
