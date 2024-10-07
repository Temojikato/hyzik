// src/components/PlayerInfo.tsx
import React, { useEffect, useState } from 'react';
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
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  collection,
  getDocs,
  runTransaction,
} from 'firebase/firestore';
import { db } from '../Firebase';
import { useAuth } from '../contexts/AuthContext';
import { ConditionDefinition, UserCondition, ConditionEffect } from '../types/Conditions';
import { Item } from '../types/Reyvateils';

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
      await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) {
          throw new Error('User data not found.');
        }

        // Find the index of the condition to update
        const conditionIndex = newConditions.findIndex(
          (con) => con.name.toLowerCase() === selectedCondition.toLowerCase()
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

  const openConditionDetails = (conditionName: string) => {
    setCurrentCondition(conditionName);
    const def = conditionDefinitions.find(
      (cond) => cond.name.toLowerCase() === conditionName.toLowerCase()
    );
    setSelectedConditionDetails(def || null);
    onDetailsOpen();
  };

  // Calculate cumulative effects based on current value and thresholds
  const getActiveEffects = (conditionName: string, value: number): ConditionEffect[] => {
    const conditionDef = conditionDefinitions.find(
      (cond) => cond.name.toLowerCase() === conditionName.toLowerCase()
    );
    if (!conditionDef) return [];

    const activeThresholds = conditionDef.thresholds.filter((threshold) => value >= threshold);
    const activeEffects: ConditionEffect[] = [];
    activeThresholds.forEach((threshold) => {
      const effect = conditionDef.conditionEffects.find(
        (eff) => eff.name.toLowerCase() === conditionName.toLowerCase() // Adjust as per your effect naming
      );
      if (effect) {
        activeEffects.push(effect);
      }
    });
    return activeEffects;
  };

  return (
    <Box ml={4} mr={4} mt={8}>
      {/* Gain Condition Button */}
      <Button colorScheme="teal" onClick={onOpen}>
        Gain Condition
      </Button>

      {/* Gain Condition Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Gain Condition</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Select
                placeholder="Select condition"
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
              >
                {conditionDefinitions.map((cond) => (
                  <option key={cond.name} value={cond.name.toLowerCase()}>
                    {cond.name}
                  </option>
                ))}
              </Select>
              <NumberInput
                value={conditionValue}
                onChange={(valueString) => {
                  const parsedValue = parseInt(valueString, 10);
                  // If parsedValue is NaN, default to 0; otherwise, use the parsed value (including negatives)
                  setConditionValue(isNaN(parsedValue) ? 0 : parsedValue);
                }}
              >
                <NumberInputField />
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
          .filter((condition) => condition.amount > 0) // Only display conditions with amount > 0
          .map((condition) => {
            const conditionDef = conditionDefinitions.find(
              (cond) => cond.name.toLowerCase() === condition.name.toLowerCase()
            );
            const maxThreshold = conditionDef?.thresholds[conditionDef.thresholds.length - 1] || 100;
            const percentage = maxThreshold !== 0 ? (condition.amount / maxThreshold) * 100 : 0;

            return (
              <Box
                key={condition.name}
                p={4}
                bg="secondary"
                borderWidth="1px"
                borderRadius="md"
                onClick={() => openConditionDetails(condition.name)}
                cursor="pointer"
                _hover={{ bg: 'gray.100' }}
              >
                <HStack justifyContent="space-between">
                  <Text fontWeight="bold">{conditionDef?.name || condition.name}</Text>
                  <Text>{condition.amount}</Text>
                </HStack>
                <Progress value={percentage} colorScheme="orange" mt={2} />
              </Box>
            );
          })}
      </VStack>

      {/* Condition Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedConditionDetails?.name || 'Condition Details'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {currentCondition && (
              <>
                <Progress
                  value={
                    selectedConditionDetails
                      ? ((conditions.find(con => con.name === currentCondition)?.amount || 0) /
                          (selectedConditionDetails.thresholds[selectedConditionDetails.thresholds.length - 1] || 100)) *
                        100
                      : 0
                  }
                  colorScheme="orange"
                  mb={4}
                />
                <Text mb={2}>
                  Current Value: {conditions.find(con => con.name === currentCondition)?.amount || 0}
                </Text>
                <List spacing={3}>
                  {selectedConditionDetails?.thresholds
                    .filter((threshold) => {
                      const condition = conditions.find(con => con.name === currentCondition);
                      return condition ? condition.amount >= threshold : false;
                    })
                    .map((threshold) => {
                      const effect = selectedConditionDetails.conditionEffects.find(
                        (eff) => eff.name.toLowerCase() === currentCondition.toLowerCase()
                      );
                      return effect ? (
                        <ListItem key={threshold}>
                          <HStack>
                            <Image src={effect.img} alt={effect.name} boxSize="24px" />
                            <Text fontWeight="semibold">{effect.name}</Text>
                            <Text>{effect.effect}</Text>
                          </HStack>
                        </ListItem>
                      ) : null;
                    })}
                </List>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PlayerInfo;
