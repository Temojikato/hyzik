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
  Box,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { Ability } from '../types/Reyvateils';
import { getAbilitySpokenForm, resolveAbilityInvocation } from '../utils/abilityHymmnos';
import { useCampaign } from '../contexts/CampaignContext';
import { FaVolumeHigh } from 'react-icons/fa6';
import { useBackDismiss } from '../contexts/BackNavigationContext';

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
  useBackDismiss(isOpen, onClose);
  const { unlockedLexicon } = useCampaign();
  const invocation = resolveAbilityInvocation(ability);
  const unlockedParts = invocation.parts.map((part) => unlockedLexicon.get(part.id));
  const isTranslationUnlocked = unlockedParts.every(Boolean);
  const visibleTranslation = unlockedParts.map((part) => part?.meaning || '•••').join(' · ');
  const spokenForm = getAbilitySpokenForm(invocation);
  const playInvocation = () => {
    if (ability.hymmnos?.audioUrl) {
      void new Audio(ability.hymmnos.audioUrl).play();
      return;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(spokenForm));
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isTranslationUnlocked ? ability.name : 'Reyvateil invocation'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="center">
            <Image
              src={ability.icon || 'https://via.placeholder.com/100'}
              alt={isTranslationUnlocked ? ability.name : 'Reyvateil ability sigil'}
              boxSize="100px"
              objectFit="cover"
              filter={isCooldownActive ? 'grayscale(100%) opacity(0.5)' : 'none'}
            />
            <Box w="100%" p={5} bg="blackAlpha.400" border="1px solid" borderColor="primary" borderRadius="xl" textAlign="center">
              <Text fontFamily="Hymmnos" fontSize="4xl" color="textHeader" overflowWrap="anywhere">{invocation.headword}</Text>
              <Text mt={2} fontWeight="bold">{invocation.pronunciation}</Text>
              <HStack justify="center" mt={3}><Badge colorScheme={unlockedParts.some(Boolean) ? 'green' : 'gray'}>{visibleTranslation}</Badge></HStack>
              <Button mt={4} size="sm" variant="outline" leftIcon={<FaVolumeHigh />} onClick={playInvocation}>Play pronunciation</Button>
            </Box>
            <Box w="100%"><Text fontSize="xs" color="textMuted" textTransform="uppercase" letterSpacing=".12em">Mechanical effect</Text><Text mt={1}>{ability.description}</Text></Box>
            <Text fontWeight="bold">Cooldown: {ability.cooldown} seconds</Text>
            <Button
              onClick={onUseAbility}
              colorScheme="blue"
              isDisabled={isCooldownActive}
              opacity={isCooldownActive ? 0.6 : 1}
              whiteSpace="normal"
              h="auto"
              minH={10}
              py={3}
            >
              {isCooldownActive ? `Cooldown (${remainingTime}s)` : `Exclaim “${spokenForm}” and activate`}
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReyvateilSkillModal;
