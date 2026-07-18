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
  VStack,
  Box,
  List,
  ListItem,
  ListIcon,
  Flex,
  Divider,
  Tooltip,
  Heading,
  BoxProps,
} from '@chakra-ui/react';
import { MdCheckCircle, MdRadioButtonUnchecked, MdStar } from 'react-icons/md';
import { Item, Reyvateil } from '../types/Reyvateils';

interface ReyvateilRitualModalProps {
  isOpen: boolean;
  onClose: () => void;
  reyvateil: Reyvateil;
  userLevel: number;
  unlockedRecipes: string[];
  inventory: Item[];
  handleRecipeUnlock: (recipe: string) => void;
  levelUp: (requirements: Item[]) => void;
}

const ReyvateilRitualModal: React.FC<ReyvateilRitualModalProps> = ({ isOpen, onClose, reyvateil, userLevel, unlockedRecipes, inventory, levelUp, handleRecipeUnlock }) => {
  const hasRequiredItemsForNextLevel = (requirements: Item[]): boolean => {
    return requirements.every(req => {
      const itemInInventory = inventory.find((item: Item) => item.name === req.name);
      const isItemSufficient = itemInInventory && itemInInventory.quantity !== undefined && itemInInventory.quantity >= (req.quantity ?? 0);
      return isItemSufficient;
    });
  };
  const hasRecipe = (recipe: string): boolean => {
    const itemInInventory = inventory.find((item: Item) => item.name === recipe);
    return itemInInventory !== undefined;
  };

  const handleLevelUp = (requirements: Item[]) => {
    levelUp(requirements);
  };

  function handleRitualUnlock(recipe: string): void {
    handleRecipeUnlock(recipe);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent bg="surface" color="text">
        <ModalHeader color="textHeader">{reyvateil.name} Ritual Details</ModalHeader>
        <ModalCloseButton color="text" />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text color="text" fontSize="lg" fontWeight="bold">Level Up Requirements:</Text>
            <List spacing={2}>
              {reyvateil.levelUpRequirements.map((req, index) => {
                const isNextLevel = userLevel + 1 === req.level;
                const canLevelUp = isNextLevel && hasRequiredItemsForNextLevel(req.components || []);

                return (
                  <ListItem key={index}>
                    <Flex align="center">
                      <ListIcon as={userLevel >= (req.level ?? 0) ? MdCheckCircle : (isNextLevel && canLevelUp ? MdStar : MdRadioButtonUnchecked)}
                        color={userLevel >= (req.level ?? 0) ? "green.500" : (isNextLevel && canLevelUp ? "gold" : "gray.500")} />
                      <Text color="text" pl={2}>
                        Level {req.level}: {req.components?.map(component => `${component.quantity}x ${component.name}`).join(', ') ?? 'No components listed'}
                      </Text>
                      {canLevelUp && <Button ml="auto" colorScheme="yellow" onClick={() => handleLevelUp(req.components || [])}>Level Up</Button>}
                    </Flex>
                  </ListItem>
                );
              })}
            </List>
            <Text color="text" fontSize="lg" fontWeight="bold" mt={6}>Evolution Options:</Text>
            {reyvateil.evolutionOptions.map((option, index) => {
              const isUnlocked = unlockedRecipes.includes(option.recipe);
              // Define blurStyle based on whether the recipe is unlocked
              const blurStyle: BoxProps = !isUnlocked
                ? { filter: 'blur(4px)', userSelect: 'none', pointerEvents: 'none' }
                : {};

              return (
                <Box key={index} p={3} bg="surfaceRaised" border="1px solid" borderColor="border" rounded="md" mt={2}>
                  <Text color="textHeader" fontWeight="bold">{option.name}</Text>
                  <Text color="text">{option.features}</Text>
                  <Divider my={2} />
                  <Text color="textHeader">Enhanced Abilities:</Text>
                  <VStack align="start" pl={4}>
                    {option.enhancedAbilities.map((ability, idx) => (
                      <Text {...blurStyle} key={idx} color="text">
                        {ability.name} - {ability.description}
                      </Text>
                    ))}
                  </VStack>
                  {option.upgradeRequirements && (
                    <VStack align="start" spacing={1} mt={2}>
                      <Heading size="sm" color="textHeader" mt={4}>Ritual Details:</Heading>
                      <Text  {...blurStyle} color="text">Ritual: {option.upgradeRequirements.ritual}</Text>
                      <Heading size="sm" color="textHeader" mt={2}>Risk of Failure:</Heading>
                      <Text  {...blurStyle} color="text">Chance of Failure: {option.upgradeRequirements.chanceOfFailure}%</Text>
                      <Text  {...blurStyle} color="text">Failure Outcome: {option.upgradeRequirements.failureOutcome}</Text>
                      <Heading size="sm" color="textHeader" mt={2}>Required Components:</Heading>
                      <VStack spacing={1}>
                        {option.upgradeRequirements.components.map((comp, idx) => (
                          <Tooltip key={idx} label={comp.description || "No description available"} hasArrow>
                            <Text {...blurStyle} w="100%" color="text">
                              {comp.quantity}x {comp.name}
                            </Text>
                          </Tooltip>
                        ))}
                      </VStack>
                    </VStack>
                  )}
                  {!isUnlocked && (
                    <VStack mt={5}>
                      <Text color="text">Requirement: {option.recipe}</Text>

                      <Button disabled={!hasRecipe(option.recipe)} colorScheme="yellow" onClick={() => handleRitualUnlock(option.recipe)}>
                        Unlock
                      </Button>
                    </VStack>
                  )}
                </Box>
              );
            })}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal >
  );
};

export default ReyvateilRitualModal;
