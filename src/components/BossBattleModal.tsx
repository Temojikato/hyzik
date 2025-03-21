// src/components/BossBattleModal.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Text,
  VStack,
  Image,
  Spinner,
} from '@chakra-ui/react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../Firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

interface BossBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
  sin: string;
  virtue: string;
}

type ModalPhase = 1 | 2 | 3;

const BossBattleModal: React.FC<BossBattleModalProps> = ({
  isOpen,
  onClose,
  sin,
  virtue,
}) => {
  const navigate = useNavigate();

  // Logout using signOut from firebase/auth.
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out', err);
    }
  };

  const [phase, setPhase] = useState<ModalPhase>(1);
  const [continueEnabled, setContinueEnabled] = useState<boolean>(false);

  // Boss data fetched from Firestore (includes phase2Snippet, bossStrategy, bossPersonality, dndBeyondLink, bossImageUrl).
  const [bossData, setBossData] = useState<{
    phase2Snippet: string;
    bossStrategy: string;
    bossPersonality: string;
    dndBeyondLink: string;
    bossImageUrl: string;
  } | null>(null);
  const [bossDataError, setBossDataError] = useState<string | null>(null);
  const [bossDataLoading, setBossDataLoading] = useState<boolean>(false);

  // Reset modal state when opened.
  useEffect(() => {
    if (isOpen) {
      setPhase(1);
      setContinueEnabled(false);
      setBossData(null);
      setBossDataError(null);
    }
  }, [isOpen]);

  // Fetch boss data as soon as the modal opens.
  useEffect(() => {
    if (!isOpen) return;
    const fetchBossData = async () => {
      setBossDataLoading(true);
      // Construct document ID: lowercase, trim, replace spaces with hyphens.
      const docId = `avatar-of-${sin.trim().toLowerCase().replace(/\s+/g, '-')}-and-${virtue
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')}`;
    
      try {
        const bossDocRef = doc(db, 'playerBosses', docId);
        const bossSnap = await getDoc(bossDocRef);
        if (bossSnap.exists()) {
          setBossData(bossSnap.data() as {
            phase2Snippet: string;
            bossStrategy: string;
            bossPersonality: string;
            dndBeyondLink: string;
            bossImageUrl: string;
          });
        } else {
          setBossDataError(`Critical error: Boss data not found for "${sin}" and "${virtue}".`);
        }
      } catch (error) {
        console.error('Error fetching boss data:', error);
        setBossDataError('Critical error: Failed to fetch boss data.');
      } finally {
        setBossDataLoading(false);
      }
    };
    fetchBossData();
  }, [isOpen, sin, virtue]);

  // For Phase 2, enable the "Continue" button after 20 seconds.
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 2) {
      timer = setTimeout(() => {
        setContinueEnabled(true);
      }, 20000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [phase]);

  // Default labels for Phase 1 are now based solely on sin and virtue.
  const defaultMainLabel = `Avatar of ${sin} and ${virtue} is overtaking you`;
  const defaultTranslationLabel = `Your inner ${sin} and ${virtue} are overwhelming you. Fight back!`;

  // Phase 1: both choices lead to Phase 2.
  const handleChoice = (choice: 'fight' | 'give in') => {
    setPhase(2);
  };

  // Phase 2: Continue button moves to Phase 3.
  const handleContinue = () => {
    setPhase(3);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      motionPreset="slideInBottom"
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay bg="blackAlpha.900" />
      <ModalContent bg="black" color="white" m={0} h="100vh">
        {/* No ModalCloseButton */}
        <ModalBody p={8} display="flex" alignItems="center" justifyContent="center">
          {phase === 1 && (
            <VStack spacing={6} w="100%" h="100%" justify="center">
              <Box textAlign="center">
                <Text fontFamily="Hymmnos" fontSize={{ base: '4xl', md: '6xl' }} fontWeight="bold">
                  {defaultMainLabel}
                </Text>
                <Text fontSize={{ base: 'xl', md: '2xl' }} mt={2}>
                  {defaultTranslationLabel}
                </Text>
              </Box>
              <Box>
                <Button colorScheme="red" size="lg" mb={4} onClick={() => handleChoice('fight')}>
                  Fight
                </Button>
                <Button colorScheme="purple" size="lg" onClick={() => handleChoice('give in')}>
                  Give In
                </Button>
              </Box>
            </VStack>
          )}

          {phase === 2 && (
            <VStack spacing={6} w="100%" h="100%" justify="center">
              <Box textAlign="center" p={4}>
                <Text fontSize="2xl" fontWeight="bold" mb={4}>
                  This is currently happening to your character, you can no longer stop it.
                  Please interrupt the game and narrate this to your fellow Players and DM.
                </Text>
                {bossData && bossData.phase2Snippet ? (
                  <Text fontSize="lg" color="gray.300">
                    {bossData.phase2Snippet}
                  </Text>
                ) : bossDataError ? (
                  <Text fontSize="lg" color="red.400">
                    {bossDataError}
                  </Text>
                ) : (
                  <Spinner size="xl" />
                )}
              </Box>
              <Box>
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={handleContinue}
                  isDisabled={!continueEnabled}
                >
                  Continue
                </Button>
                {!continueEnabled && (
                  <Text fontSize="sm" mt={2} color="gray.500">
                    Please wait 20 seconds…
                  </Text>
                )}
              </Box>
            </VStack>
          )}

          {phase === 3 && (
            <VStack spacing={6} w="100%" h="100%" justify="center">
              {bossDataLoading ? (
                <Spinner size="xl" />
              ) : bossDataError ? (
                <Box textAlign="center">
                  <Text fontSize="2xl" color="red.400" fontWeight="bold">
                    {bossDataError}
                  </Text>
                  <Button colorScheme="red" size="lg" onClick={handleLogout} mt={4}>
                    Log Out
                  </Button>
                </Box>
              ) : (
                <>
                  <Image
                    src={bossData?.bossImageUrl}
                    alt={`Avatar of ${sin} and ${virtue}`}
                    boxSize={{ base: '200px', md: '300px' }}
                    objectFit="contain"
                    borderRadius="md"
                  />
                  <Box textAlign="center">
                    <Text
                      fontFamily="Hymmnos"
                      fontSize={{ base: '4xl', md: '6xl' }}
                      fontWeight="bold"
                    >
                      Avatar of {sin} and {virtue}
                    </Text>
                    <Text
                      fontSize={{ base: '2xl', md: '4xl' }}
                      fontWeight="bold"
                    >
                      Avatar of {sin} and {virtue}
                    </Text>
                    <Text fontSize="lg" mt={2}>
                      Strategy: {bossData?.bossStrategy}
                    </Text>
                    <Text fontSize="lg" mt={2}>
                      Personality: {bossData?.bossPersonality}
                    </Text>
                  </Box>
                  <Button
                    as="a"
                    href={bossData?.dndBeyondLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    colorScheme="purple"
                    size="lg"
                  >
                    View Stat Block on DnD Beyond
                  </Button>
                  <Button colorScheme="red" size="lg" onClick={handleLogout}>
                    Log Out
                  </Button>
                </>
              )}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter
          justifyContent="center"
          borderTop="1px solid"
          borderColor="gray.700"
        >
          <Text fontSize="sm" color="gray.500">
            Final Boss Battle
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BossBattleModal;
