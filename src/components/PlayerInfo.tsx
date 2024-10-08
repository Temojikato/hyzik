// src/components/PlayerInfo.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  Progress,
  Text,
  VStack,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Image,
  List,
  ListItem,
  useToast,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react'; // Correct import for keyframes
import {
  doc,
  getDoc,
  collection,
  getDocs,
  runTransaction,
} from 'firebase/firestore';
import { db } from '../Firebase';
import { useAuth } from '../contexts/AuthContext';
import { ConditionDefinition, UserCondition, ConditionEffect } from '../types/Conditions';
import { Item } from '../types/Reyvateils';

// Define pulsate animation for Progress bar
const pulsate = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
`;

// Define borderGlow animation for Box border
const borderGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.8); }
  100% { box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); }
`;

// Define a mapping from condition names to color schemes
const conditionColorMap: { [key: string]: string } = {
  madness: 'yellow',
  // Add more mappings as needed
};

const PlayerInfo: React.FC = () => {
  const { currentUser } = useAuth();
  const [conditions, setConditions] = useState<UserCondition[]>([]);
  const [conditionDefinitions, setConditionDefinitions] = useState<ConditionDefinition[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure(); // For Gain Condition Modal
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [conditionValue, setConditionValue] = useState<number>(1);
  const toast = useToast();

  const [selectedConditionDetails, setSelectedConditionDetails] = useState<ConditionDefinition | null>(null);
  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose,
  } = useDisclosure(); // For Condition Details Modal
  const [currentCondition, setCurrentCondition] = useState<string>('');

  // State to track the currently active effect
  const [activeEffect, setActiveEffect] = useState<{ conditionName: string; effect: ConditionEffect } | null>(null);
  // State to hold the effect to display in the modal
  const [activatedEffect, setActivatedEffect] = useState<ConditionEffect | null>(null);
  const {
    isOpen: isEffectModalOpen,
    onOpen: onEffectModalOpen,
    onClose: onEffectModalClose,
  } = useDisclosure(); // For Effect Activated Modal

  // Timer states
  const [effectTimer, setEffectTimer] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Determine if we're in a testing environment
  const isTesting = process.env.NODE_ENV === 'development';

  // Helper function to format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    const fetchConditions = async () => {
      if (!currentUser) return;

      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setConditions(userData.conditions || []); // Updated to handle array
        }

        // Fetch condition definitions from Firestore
        const conditionsDefRef = collection(db, 'conditionDefinitions');
        const conditionsDefSnap = await getDocs(conditionsDefRef);
        const defs: ConditionDefinition[] = conditionsDefSnap.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<ConditionDefinition, 'id'>),
        }));

        // Adjust image paths if necessary
        defs.forEach((condition: ConditionDefinition) => {
          condition.conditionEffects.forEach((effect: ConditionEffect) => {
            effect.img = `conditions/${condition.name.toLowerCase()}/${effect.name.toLowerCase()}.png`;
          });
        });

        setConditionDefinitions(defs);
      } catch (error) {
        console.error('Error fetching conditions:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch conditions.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchConditions();
  }, [currentUser, toast]);

  // Function to get active effects based on thresholds
  const getActiveEffects = (conditionName: string, value: number): ConditionEffect[] => {
    const conditionDef = conditionDefinitions.find(
      cond => cond.name.toLowerCase() === conditionName.toLowerCase()
    );
    if (!conditionDef) return [];

    // Get all thresholds that have been met
    const activeThresholds = conditionDef.thresholds.filter(threshold => value >= threshold);
    const activeEffects: ConditionEffect[] = [];

    for (let index = 0; index < activeThresholds.length; index++) {
      if (conditionDef.conditionEffects[index] !== undefined) {
        activeEffects.push(conditionDef.conditionEffects[index]);
      }
    }

    return activeEffects;
  };

  // Refactored checkConditions to accept a force parameter
  const checkConditions = (force: boolean = false) => {
    // Clear current active effect and timer
    setActiveEffect(null);
    setActivatedEffect(null);
    setEffectTimer(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  
    const eligibleEffects: { conditionName: string; effect: ConditionEffect }[] = [];
  
    conditions.forEach((condition) => {
      const activeEffectsForCondition = getActiveEffects(condition.name, condition.amount);
      if (activeEffectsForCondition.length > 0) {
        // Determine whether to activate based on force or random chance
        const shouldActivate = force ? true : Math.random() < 0.05; // 5% chance
        if (shouldActivate) {
          // Select a random effect from activeEffectsForCondition
          const randomIndex = Math.floor(Math.random() * activeEffectsForCondition.length);
          const selectedEffect = activeEffectsForCondition[randomIndex];
          eligibleEffects.push({ conditionName: condition.name, effect: selectedEffect });
        }
      }
    });
  
    if (eligibleEffects.length > 0) {
      // Choose one effect randomly from all eligible effects
      const randomIndex = Math.floor(Math.random() * eligibleEffects.length);
      const chosenEffect = eligibleEffects[randomIndex];
      // Update active effect
      setActiveEffect(chosenEffect);
      setActivatedEffect(chosenEffect.effect);
      onEffectModalOpen();
  
      // Initialize timer with random duration between 4 to 10 minutes
      const duration = getRandomDuration(240, 600); // 240s = 4min, 600s = 10min
      setEffectTimer(duration);
    }
  };
  

  // Handle gaining or updating a condition
  const handleGainCondition = async () => {
    if (!currentUser) {
      toast({
        title: 'Error',
        description: 'No user or Reyvateil found.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const userRef = doc(db, 'users', currentUser.uid);
    // Prepare the condition to add or update
    const conditionToAdd: UserCondition = { name: selectedCondition, amount: conditionValue };

    try {
      let newConditions = [...conditions]; // Clone the current conditions
      await runTransaction(db, async transaction => {
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) {
          throw new Error('User data not found.');
        }

        // Find the index of the condition to update
        const conditionIndex = newConditions.findIndex(
          con => con.name.toLowerCase() === selectedCondition.toLowerCase()
        );

        if (conditionIndex !== -1) {
          // Update existing condition
          newConditions[conditionIndex].amount += conditionValue;

          // Prevent amount from going below 0
          if (newConditions[conditionIndex].amount < 0) {
            newConditions[conditionIndex].amount = 0;
          }

          // Remove condition if amount is exactly 0
          if (newConditions[conditionIndex].amount === 0) {
            newConditions.splice(conditionIndex, 1);
          }
        } else {
          // Add new condition
          newConditions.push(conditionToAdd);
        }

        // Update Firestore with the new conditions array
        transaction.update(userRef, {
          conditions: newConditions,
        });
      });

      // **Important:** Update the local state to reflect changes
      setConditions(newConditions);

      onClose();
      // Reset fields
      setSelectedCondition('');
      setConditionValue(1);
      toast({
        title: 'Success',
        description: 'Condition updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error gaining condition:', error);
      toast({
        title: 'Update Failed',
        description: 'There was an error updating the condition.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Function to open condition details modal
  const openConditionDetails = (conditionName: string) => {
    setCurrentCondition(conditionName);
    const def = conditionDefinitions.find(
      cond => cond.name.toLowerCase() === conditionName.toLowerCase()
    );
    setSelectedConditionDetails(def || null);
    onDetailsOpen();
  };

  // Effect to handle periodic checks for activating effects
  useEffect(() => {
    // Function to perform checks
    const performCheck = () => {
      checkConditions(); // Regular check without forcing
    };

    // Check if there are any conditions that can activate effects
    const hasEligibleConditions = conditions.some(
      condition => getActiveEffects(condition.name, condition.amount).length > 0
    );

    if (hasEligibleConditions) {
      // Perform an initial check immediately
      performCheck();

      // Set up interval to run every 10 minutes
      const intervalId = setInterval(() => {
        performCheck();
      }, 10 * 60 * 1000); // 10 minutes

      // Cleanup interval on unmount or when dependencies change
      return () => clearInterval(intervalId);
    }
  }, [conditions, conditionDefinitions]);

  // Timer useEffect
  useEffect(() => {
    if (effectTimer === null) return;

    // If an interval is already set, do not set another
    if (timerRef.current) return;

    // Set up the interval to decrement the timer every second
    timerRef.current = setInterval(() => {
      setEffectTimer(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          // Time's up, reset all related states
          clearInterval(timerRef.current!);
          timerRef.current = null;
          setActiveEffect(null);
          setActivatedEffect(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts or effectTimer changes
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [effectTimer]);

  // Inside your PlayerInfo component
  const getRandomDuration = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };


  return (
    <Box ml={4} mr={4} mt={8}>
      {/* Gain Condition Button */}
      <Button colorScheme="teal" onClick={onOpen}>
        Gain Condition
      </Button>

      {/* Test Effect Activation Button (Only in Development) */}
      {isTesting && (
        <Button
          colorScheme="yellow"
          onClick={() => checkConditions(true)} // Force activation for testing
          ml={4} // Add left margin for spacing
        >
          Test Effect Activation
        </Button>
      )}

      {/* Gain Condition Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg"> {/* Increased size */}
        <ModalOverlay />
        <ModalContent
          bg="gray.800" // Dark background
          color="white" // White text
          borderRadius="lg"
          boxShadow="2xl"
        >
          <ModalHeader>Gain Condition</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Select
                placeholder="Select condition"
                value={selectedCondition}
                onChange={e => setSelectedCondition(e.target.value)}
                bg="gray.700" // Darker background for Select
                color="white" // White text
                _placeholder={{ color: 'gray.400' }} // Placeholder color
              >
                {conditionDefinitions.map(cond => (
                  <option key={cond.name} value={cond.name.toLowerCase()}>
                    {cond.name}
                  </option>
                ))}
              </Select>
              <NumberInput
                value={conditionValue}
                onChange={valueString => {
                  const parsedValue = parseInt(valueString, 10);
                  // If parsedValue is NaN, default to 0; otherwise, use the parsed value (including negatives)
                  setConditionValue(isNaN(parsedValue) ? 0 : parsedValue);
                }}
              >
                <NumberInputField
                  bg="gray.700" // Darker background for NumberInput
                  color="white" // White text
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <Button colorScheme="blue" onClick={handleGainCondition}>
                Submit
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Conditions List */}
      <VStack spacing={4} align="stretch" mt={4}>
        {conditions
          .filter(condition => condition.amount > 0) // Only display conditions with amount > 0
          .map(condition => {
            const conditionDef = conditionDefinitions.find(
              cond => cond.name.toLowerCase() === condition.name.toLowerCase()
            );
            const maxThreshold = conditionDef?.thresholds[conditionDef.thresholds.length - 1] || 100;
            const percentage = maxThreshold !== 0 ? (condition.amount / maxThreshold) * 100 : 0;

            // Determine if this condition has an active effect
            const isActive = activeEffect?.conditionName === condition.name;

            return (
              <Box
                key={condition.name}
                p={4}
                bg="secondary"
                borderWidth="1px"
                borderColor={isActive ? (conditionColorMap[condition.name.toLowerCase()] || 'purple') : 'black'}
                borderRadius="md"
                onClick={() => openConditionDetails(condition.name)}
                cursor="pointer"
                _hover={{ bg: 'gray.100' }}
                animation={isActive ? `${borderGlow} 2s infinite` : undefined} // Apply borderGlow animation when active
              >
                <HStack justifyContent="space-between">
                  <Text fontWeight="bold">{conditionDef?.name || condition.name}</Text>
                  <Text>{condition.amount}</Text>
                </HStack>
                {isActive && effectTimer !== null ? (
                  <Text mt={2} fontWeight="bold" color="yellow.400">
                    Time Remaining: {formatTime(effectTimer)}
                  </Text>
                ) : (
                  <Progress
                    value={percentage}
                    colorScheme={conditionColorMap[condition.name.toLowerCase()]}
                    mt={2}
                    // Apply pulsate animation if active
                    animation={isActive ? `${pulsate} 2s infinite` : undefined}
                    transition="animation 0.5s ease-in-out"
                  />
                )}
              </Box>
            );
          })}
      </VStack>

      {/* Condition Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="3xl"> {/* Increased size */}
        <ModalOverlay />
        <ModalContent
          bg="gray.800" // Dark background
          color="white" // White text
          borderRadius="lg"
          boxShadow="2xl"
        >
          <ModalHeader>{selectedConditionDetails?.name || 'Condition Details'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {currentCondition && (
              <>
                <Progress
                  value={
                    selectedConditionDetails
                      ? (
                        (conditions.find(con => con.name.toLowerCase() === currentCondition.toLowerCase())?.amount || 0) /
                        (selectedConditionDetails.thresholds[selectedConditionDetails.thresholds.length - 1] || 100)
                      ) * 100
                      : 0
                  }
                  colorScheme="orange"
                  mb={4}
                />
                <Text mb={2}>
                  Current Value: {conditions.find(con => con.name.toLowerCase() === currentCondition.toLowerCase())?.amount || 0}
                </Text>
                <Text mt={6}>
                  Possible Effects:
                </Text>
                <List mt={3} mb={3} spacing={3}>
                  {getActiveEffects(
                    currentCondition,
                    conditions.find(con => con.name.toLowerCase() === currentCondition.toLowerCase())?.amount || 0
                  ).map(effect => {

                    const isActiveEffect = activeEffect?.effect.name === effect.name;

                    return (
                      <ListItem key={effect.name}>
                        <Box
                          p={4}
                          bg="gray.700" // Slightly lighter dark background
                          borderWidth="1px"
                          borderColor={isActiveEffect ? (conditionColorMap[currentCondition.toLowerCase()] || 'purple') : 'black'}
                          borderRadius="md"
                          boxShadow="md"
                          _hover={{ boxShadow: 'lg' }}
                          transition="box-shadow 0.3s ease-in-out"
                          animation={isActiveEffect ? `${pulsate} 2s infinite` : undefined} // Apply pulsate animation if active
                        >
                          <HStack spacing={4} align="start">
                            <Image src={effect.img} boxSize="48px" />
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="semibold">{effect.name}</Text>
                              <Text>{effect.effect}</Text>
                            </VStack>
                            {isActiveEffect && effectTimer !== null && (
                              <Text fontWeight="bold" color="yellow.400">
                                {formatTime(effectTimer)}
                              </Text>
                            )}
                          </HStack>
                        </Box>
                      </ListItem>
                    )
                  })}
                </List>

              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>


      {/* Effect Activated Modal */}
      <Modal isOpen={isEffectModalOpen} onClose={onEffectModalClose} isCentered size="xl"> {/* Increased size */}
        <ModalOverlay />
        <ModalContent
          bg="gray.900" // Darker background for more spooky feel
          color="white" // White text
          borderRadius="lg"
          boxShadow="2xl"
        >
          <ModalHeader>Effect Activated</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {activatedEffect && (
              <VStack spacing={4} align="center">
                <Image src={activatedEffect.img} boxSize="48px" />
                <HStack>
                  <Text fontWeight="bold" fontSize="lg" color="red.400">
                    EFFECT ACTIVATED: {activatedEffect.name}
                  </Text>
                  {effectTimer !== null && (
                    <Text fontWeight="bold" color="yellow.400">
                      Time Remaining: {formatTime(effectTimer)}
                    </Text>
                  )}
                </HStack>
                <Text>{activatedEffect.effect}</Text>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PlayerInfo;
