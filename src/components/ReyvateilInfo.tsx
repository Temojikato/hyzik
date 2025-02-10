// src/components/ReyvateilInfo.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { DocumentReference, runTransaction } from 'firebase/firestore';
import {
  Box,
  Image,
  Text,
  Button,
  Flex,
  Grid,
  GridItem,
  useDisclosure,
  Spinner,
  VStack,
  HStack,
  Tooltip,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import { doc, getDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { db, storage } from '../Firebase';
import { Reyvateil, Ability, Item, DBItem } from '../types/Reyvateils';
import ReyvateilSkillModal from './ReyvateilSkillModal';
import { useAuth } from '../contexts/AuthContext';
import ReyvateilRitualModal from './ReyvateilRitualModal';
import ErrorBoundary from './ErrorBoundary';
import { useThemeContext } from '../contexts/ThemeContext';
import { getDownloadURL, ref } from 'firebase/storage';
import {
  setCooldown,
  getCooldown,
  clearCooldown,
  getAllCooldowns,
} from '../CooldownUtils';
import FeedModal from './FeedModal';

interface ReyvateilInfoProps {
  reyvateil: Reyvateil | null;
  inventory: Item[];
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
}

const ReyvateilInfo: React.FC<ReyvateilInfoProps> = ({ reyvateil, inventory, setInventory }) => {
  const { currentUser } = useAuth();
  const { setReyvateilTheme } = useThemeContext(); // Access theme context
  const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false);
  const [isRitualOpen, setIsRitualOpen] = useState<boolean>(false);
  const [criticalError, setCriticalError] = useState<string>('');
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const [userLevel, setUserLevel] = useState<number>(0);
  const [unlockedRecipes, setUnlockedRecipes] = useState<string[]>([]);
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const [isFeedModalOpen, setIsFeedModalOpen] = useState<boolean>(false);
  const toast = useToast();

  // Initialize cooldowns from localStorage
  useEffect(() => {
    const initializeCooldowns = () => {
      const allCooldowns = getAllCooldowns();
      const updatedCooldowns: Record<string, number> = {};

      const currentTime = Date.now();

      Object.entries(allCooldowns).forEach(([abilityName, endTime]) => {
        if (typeof endTime === 'number' && endTime > currentTime) {
          updatedCooldowns[abilityName] = endTime;
        } else {
          clearCooldown(abilityName);
        }
      });

      setCooldowns(updatedCooldowns);
    };

    initializeCooldowns();
  }, []);

  // Update cooldowns every second
  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = Date.now();
      const updatedCooldowns: Record<string, number> = {};

      Object.entries(cooldowns).forEach(([abilityName, endTime]) => {
        if (endTime > currentTime) {
          updatedCooldowns[abilityName] = endTime;
        } else {
          clearCooldown(abilityName);
        }
      });

      setCooldowns(updatedCooldowns);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldowns]);

  // Fetch selected image and user data
  useEffect(() => {
    const fetchSelectedImage = async () => {
      if (currentUser && reyvateil) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setSelectedImageUrl(userData.reyvateilImageUrl || reyvateil.image || '');
            setUserLevel(userData.reyvateilLevel || 0);
            setUnlockedRecipes(userData.unlockedRecipes || []);
          } else {
            setSelectedImageUrl(reyvateil.images?.[0] || reyvateil.image || '');
          }
        } catch (error) {
          console.error('Error fetching selected Reyvateil image:', error);
          setSelectedImageUrl(reyvateil.image || '');
        }
      }
    };

    fetchSelectedImage();
  }, [currentUser, reyvateil]);

  // Set theme based on Reyvateil's name
  useEffect(() => {
    if (reyvateil) {
      setReyvateilTheme(reyvateil.name); // Set the theme based on Reyvateil's name
    }
  }, [reyvateil, setReyvateilTheme]);

  // Fetch ability icons from Firebase Storage
  useEffect(() => {
    const getAbilityIcons = async () => {
      if (reyvateil?.abilities) {
        const updatedAbilities = await Promise.all(
          reyvateil.abilities.map(async (ability) => {
            try {
              const folderRef = ref(storage, `reyvateils/icons/${ability.name}.png`);
              const imgUrl = await getDownloadURL(folderRef);
              return { ...ability, icon: imgUrl };
            } catch (error) {
              console.error(`Error fetching icon for ${ability.name}:`, error);
              return ability;
            }
          })
        );
        setAbilities(updatedAbilities);
      }
    };

    getAbilityIcons();
  }, [reyvateil]);

  // Handle ability button click
  const handleAbilityClick = (ability: Ability) => {
    setSelectedAbility(ability);
    onOpen();
  };

  // Handle using an ability
  const handleUseAbility = useCallback(
    (ability: Ability) => {
      if (!currentUser || !reyvateil) {
        toast({
          title: 'Error',
          description: 'No user or Reyvateil found.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const currentTime = Date.now();
      const cooldownEndTime = currentTime + ability.cooldown * 1000;

      // Update localStorage
      setCooldown(ability.name, cooldownEndTime);

      // Update state
      setCooldowns((prev) => ({
        ...prev,
        [ability.name]: cooldownEndTime,
      }));
    },
    [currentUser, reyvateil, toast]
  );

  // Handle feeding the Reyvateil
  const handleFeedConfirmed = async (feedItem: Item) => {
    if (!currentUser || !reyvateil) {
      toast({
        title: 'Error',
        description: 'No user or Reyvateil found.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      // First, remove one unit of the selected feed item from the user’s inventory.
      const userRef = doc(db, 'users', currentUser.uid);
      await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) {
          throw new Error('User data not found.');
        }
        // Copy local inventory and update
        const newInventory = [...inventory];
        const itemIndex = newInventory.findIndex((item) => item.id === feedItem.id);
        if (itemIndex !== -1) {
          const item = newInventory[itemIndex];
          if (item.quantity && item.quantity > 1) {
            item.quantity -= 1;
          } else {
            newInventory.splice(itemIndex, 1);
          }
          // Update the Firestore user document’s inventory.
          transaction.update(userRef, {
            inventory: newInventory.map((item) => ({
              reference: doc(db, 'items', item.id),
              quantity: item.quantity,
            })),
          });
        }
      });

      // Now perform the feed action: reset all ability cooldowns.
      const cooldownsRef = collection(db, 'users', currentUser.uid, 'cooldowns');
      const abilitiesRef = collection(db, 'reyvateils', reyvateil.id, 'abilities');
      const abilitiesSnapshot = await getDocs(abilitiesRef);

      const batch = writeBatch(db);
      abilitiesSnapshot.forEach((abilityDoc) => {
        const cooldownDocRef = doc(cooldownsRef, abilityDoc.id);
        batch.set(cooldownDocRef, { lastUsed: null }, { merge: true });
      });

      await batch.commit();

      toast({
        title: 'Reyvateil Fed',
        description: `${reyvateil.name} has been fed and all ability cooldowns have been reset!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Clear all cooldowns from state and localStorage.
      Object.keys(cooldowns).forEach((abilityName) => clearCooldown(abilityName));
      setCooldowns({});

      // Close the feed modal.
      setIsFeedModalOpen(false);
    } catch (error: any) {
      console.error('Error feeding Reyvateil:', error);
      toast({
        title: 'Feeding Failed',
        description: 'Failed to feed Reyvateil. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Instead of immediately feeding the Reyvateil, open the feed modal.
  const handleFeedClick = () => {
    setIsFeedModalOpen(true);
  };


  // Utility function to capitalize first letter and add spaces before capitals
  const capitalizeFirstLetter = (str: string): string => {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (char) => char.toUpperCase());
  };
  // Handle leveling up
  const handleLevelUp = async (levelRequirements: Item[]) => {
    if (!currentUser || !reyvateil) {
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

    try {
      let newInventory = [...inventory];
      await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) {
          throw new Error('User data not found.');
        }

        const userData = userSnap.data();

        levelRequirements.forEach((reqItem: Item) => {
          const itemIndex = newInventory.findIndex((item) => item.id === reqItem.name);
          const item = newInventory[itemIndex];
          if (
            itemIndex !== -1 &&
            item != undefined &&
            item.quantity != undefined &&
            reqItem.quantity &&
            item.quantity >= reqItem.quantity
          ) {
            item.quantity -= reqItem.quantity;
            if (newInventory[itemIndex].quantity === 0) {
              newInventory.splice(itemIndex, 1);
            }
          }
        });

        const nextLevel = reyvateil.levelUpRequirements.find(
          (req) => req.level === (userData.reyvateilLevel || 0) + 1
        )?.level;

        transaction.update(userRef, {
          inventory: newInventory.map((item) => ({
            reference: doc(db, 'items', item.id),
            quantity: item.quantity,
          })),
          reyvateilLevel: nextLevel || userLevel + 1, // Fallback to increment if nextLevel is undefined
        });
      });

      setInventory(newInventory);
      setUserLevel(userLevel + 1);

      toast({
        title: 'Success',
        description: `${reyvateil.name} has leveled up!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to level up. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle opening ritual modal
  const handleRitual = () => {
    setIsRitualOpen(true);
  };

  // Handle unlocking recipes
  const handleRecipeUnlock = async (recipe: string): Promise<void> => {
    if (!currentUser || !reyvateil) {
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
    try {
      let newInventory = [...inventory];
      await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) {
          throw new Error('User data not found.');
        }

        const userData = userSnap.data();

        const itemIndex = newInventory.findIndex((item) => item.name === recipe);
        if (
          itemIndex !== -1 &&
          newInventory !== undefined &&
          newInventory[itemIndex] !== undefined &&
          newInventory[itemIndex].quantity !== undefined
        ) {
          const item = newInventory[itemIndex];
          item.quantity = (item.quantity || 0) - 1;
          if (item.quantity <= 0) {
            newInventory.splice(itemIndex, 1);
          }
        }

        transaction.update(userRef, {
          inventory: newInventory.map((item) => ({
            reference: doc(db, 'items', item.id),
            quantity: item.quantity,
          })),
          unlockedRecipes: [...(userData.unlockedRecipes || []), recipe],
        });
      });

      setInventory(newInventory);
      setUnlockedRecipes([...unlockedRecipes, recipe]);

      toast({
        title: 'Success',
        description: `${recipe} has been unlocked!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Transaction failed:', error);
      toast({
        title: 'Error',
        description: `Failed to unlock recipe. Please try again :: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle using an ability from the modal
  const handleAbilityUse = (ability: Ability) => {
    handleUseAbility(ability);
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" color="primary" />
      </Flex>
    );
  }

  return (
    <Box p={4} maxW="100%" overflowX="auto" bg="background">
      <VStack spacing={4} align="start">
        {criticalError && (
          <Alert status="error" borderRadius="md" width="100%" bg="primary">
            <AlertIcon />
            {criticalError}
          </Alert>
        )}

        <Box
          w="100%"
          p={4}
          bg="secondary"
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          boxShadow="sm"
        >
          <VStack spacing={4} align="start">
            <Flex direction="row" align="center">
              <Text fontSize="3xl" fontWeight="bold" color="text">
                {reyvateil ? reyvateil.name : 'Unknown Reyvateil'} (Lv. {userLevel})
              </Text>

              <Text
                fontSize="3xl"
                fontWeight="bold"
                color="textHeader"
                fontFamily="Hymmnos"
                ml={2}
              >
                ({reyvateil ? reyvateil.name : 'Unknown Reyvateil'} (Lv. {userLevel}))
              </Text>
            </Flex>

            <Flex direction={{ base: 'column', md: 'row' }} align="center">
              <Image
                src={
                  selectedImageUrl ||
                  (reyvateil ? reyvateil.image : 'placeholder-image')
                }
                alt={reyvateil ? reyvateil.name : 'Unknown Reyvateil'}
                objectFit="cover"
                borderRadius="md"
                mr={{ base: 0, md: 4 }}
                mb={{ base: 4, md: 0 }}
                border="1px solid"
                borderColor="gray.300"
              />
              <Box>
                <Flex direction="row" align="center">
                  <Text fontFamily="Hymmnos" fontSize="2xl" fontWeight="bold" color="textHeader">
                    Class:
                  </Text>

                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color="text"
                    ml={2}
                  >
                    {reyvateil ? reyvateil.class : 'No class available.'}
                  </Text>
                </Flex>
                <Text fontSize="2xl" fontFamily="Hymmnos" fontWeight="semibold" color="textHeader">
                  Features:
                </Text>
                <Text color="text">{reyvateil ? reyvateil.features : 'No features available.'}</Text>

                <Box mt={2}>
                  <Text fontSize="2xl" fontFamily="Hymmnos" fontWeight="semibold" color="textHeader">
                    Stats:
                  </Text>
                  <ErrorBoundary>
                    {reyvateil && reyvateil.stats ? (
                      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                        {Object.entries(reyvateil.stats).map(([stat, value]) => (
                          <Box
                            key={stat}
                            p={2}
                            bg="accent"
                            borderRadius="md"
                            border="1px solid"
                            borderColor="gray.200"
                          >
                            <Text fontWeight="medium" color="text">
                              {capitalizeFirstLetter(stat.replace(/([A-Z])/g, ' $1'))}: {value}
                            </Text>
                          </Box>
                        ))}
                      </Grid>
                    ) : (
                      <Alert status="error" borderRadius="md" mt={2}>
                        <AlertIcon />
                        {criticalError.includes('stats')
                          ? criticalError
                          : 'Reyvateil stats are missing. Please contact support or update the data.'}
                      </Alert>
                    )}
                  </ErrorBoundary>
                </Box>
              </Box>
            </Flex>
          </VStack>
        </Box>

        <Box
          w="100%"
          p={4}
          bg="secondary"
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          boxShadow="sm"
        >
          <VStack spacing={4} align="start">
            <Text fontFamily="Hymmnos" fontSize="lg" fontWeight="semibold" mb={2} color="textHeader">
              Abilities:
            </Text>
            <ErrorBoundary>
              <Grid
                templateColumns="repeat(3, 1fr)"  // 3 columns
                templateRows="repeat(2, 1fr)"    // 2 rows, total 6 cells
                gap={4}
                justifyItems="center"
                alignItems="center"
              >
                {abilities?.map((ability) => {
                  const cooldownEndTime = cooldowns[ability.name] || 0;
                  const currentTime = Date.now();
                  const isCooldownActive = cooldownEndTime > currentTime;
                  const remainingTime = isCooldownActive
                    ? Math.ceil((cooldownEndTime - currentTime) / 1000)
                    : 0;

                  return (
                    <GridItem key={ability.name}>
                      <VStack spacing={2} align="center">
                        <Text fontSize="sm" textAlign="center" fontWeight="medium" color="text">
                          {ability.name}
                        </Text>
                        <Tooltip label={ability.name} aria-label={ability.name}>
                          <Button
                            onClick={() => handleAbilityClick(ability)}
                            borderRadius="full"
                            width="90px"
                            height="90px"
                            padding="0"
                            _hover={{ bg: 'gray.100' }}
                            _active={{ bg: 'gray.200' }}
                            disabled={isCooldownActive}
                            opacity={isCooldownActive ? 0.6 : 1}
                            position="relative"
                          >
                            <Image
                              src={ability.icon || 'https://via.placeholder.com/100'}
                              alt={ability.name}
                              objectFit="cover"
                              filter={isCooldownActive ? 'grayscale(100%) opacity(0.5)' : 'none'}
                            />
                            {isCooldownActive && (
                              <Text
                                position="absolute"
                                bottom="2px"
                                right="2px"
                                bg="blackAlpha.700"
                                color="white"
                                fontSize="xs"
                                borderRadius="md"
                                px={1}
                              >
                                {remainingTime}s
                              </Text>
                            )}
                          </Button>
                        </Tooltip>
                      </VStack>
                    </GridItem>
                  );
                })}
                </Grid>
            </ErrorBoundary>
          </VStack>
        </Box>

        <Box
          w="100%"
          p={4}
          bg="secondary"
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          boxShadow="sm"
        >
          <HStack spacing={4}>
            <Button colorScheme="green" fontFamily="Hymmnos" onClick={handleFeedClick}>
              Feed
            </Button>
            <Button colorScheme="purple" fontFamily="Hymmnos" onClick={handleRitual}>
              Ritual
            </Button>
          </HStack>
        </Box>
      </VStack>

      {/* Feed Modal */}
      <FeedModal
        isOpen={isFeedModalOpen}
        onClose={() => setIsFeedModalOpen(false)}
        inventory={inventory}
        onConfirm={handleFeedConfirmed}
      />

      {/* Ability Modal */}
      {selectedAbility && (
        <ReyvateilSkillModal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setSelectedAbility(null);
          }}
          ability={selectedAbility}
          isCooldownActive={
            Boolean(cooldowns[selectedAbility.name] && cooldowns[selectedAbility.name] > Date.now())
          }
          remainingTime={
            cooldowns[selectedAbility.name]
              ? Math.ceil((cooldowns[selectedAbility.name] - Date.now()) / 1000)
              : 0
          }
          onUseAbility={() => handleAbilityUse(selectedAbility)}
        />
      )}

      {/* Ritual Modal */}
      {reyvateil && (
        <ReyvateilRitualModal
          isOpen={isRitualOpen}
          onClose={() => setIsRitualOpen(false)}
          reyvateil={reyvateil}
          userLevel={userLevel}
          unlockedRecipes={unlockedRecipes}
          inventory={inventory}
          levelUp={handleLevelUp}
          handleRecipeUnlock={handleRecipeUnlock}
        />
      )}
    </Box>
  );
};
export default ReyvateilInfo;
