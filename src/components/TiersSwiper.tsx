import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Badge,
  Heading,
  useBreakpointValue,
  Grid,
  Button,
  useToast,
  VStack
} from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

import { MonsterTier, MonsterSpecies } from '../types/BestiaryTypes';
import TierImage from './TierImage';
import { rollLootSource } from '../services/campaignService';
import { Item } from '../types/Reyvateils';
import { User } from 'firebase/auth';

interface TiersSwiperProps {
  monster: MonsterSpecies;
  loreLocked: boolean;
  tiers: MonsterTier[];
  inventory: Item[];
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
  currentUser: User | null;
}

const TiersSwiper: React.FC<TiersSwiperProps> = ({
  monster,
  loreLocked,
  tiers,
  inventory,
  setInventory,
  currentUser
}) => {
  const [reorderedTiers, setReorderedTiers] = useState<MonsterTier[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const toast = useToast();

  const slidesPerView = useBreakpointValue({ base: 1.0, md: 1.4 });
  const monsterName = monster.name;
  const monsterLore = monster.Lore;
  const loreEntries = monsterLore ? [
    ['Formation', monsterLore.Formation],
    ['Social Tendencies', monsterLore['Social Tendencies']],
    ['Habitat', monsterLore.Habitat],
    ['Behavior', monsterLore.Behavior],
    ['Rarity', monsterLore.Rarity],
  ].filter((entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].trim().length > 0) : [];
  const loreUnlockCount = monster.discoveryManaged
    ? Math.max(0, Math.min(loreEntries.length, Number(monster.loreUnlockCount || 0)))
    : loreLocked ? 0 : loreEntries.length;

  const currentTier = reorderedTiers[displayIndex] || null;

  useEffect(() => {
    if (!tiers || tiers.length === 0) {
      setReorderedTiers([]);
      setSlideIndex(0);
      setDisplayIndex(0);
      return;
    }

    const newArr = [...tiers];
    // Move first unlocked tier to the front
    const firstUnlockedIdx = newArr.findIndex(t => !t.Locked);

    if (firstUnlockedIdx > 0) {
      const [unlockedTier] = newArr.splice(firstUnlockedIdx, 1);
      newArr.unshift(unlockedTier);
      setSlideIndex(0);
      setDisplayIndex(0);
    } else {
      setSlideIndex(Math.max(0, firstUnlockedIdx));
      setDisplayIndex(Math.max(0, firstUnlockedIdx));
    }

    setReorderedTiers(newArr);
  }, [tiers]);

  const handleSlideChange = (swiper: SwiperType) => {
    const newIdx = swiper.activeIndex;
    setSlideIndex(newIdx);

    const newTier = reorderedTiers[newIdx];
    if (newTier && !newTier.Locked) {
      setDisplayIndex(newIdx);
    }
  };

  function formatStatKey(statKey: string): string {
    const spaced = statKey.replace(/([A-Z])/g, ' $1'); // e.g. "DexterityScore" => "Dexterity Score"
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  }

  const handleLoot = async () => {
    if (!currentTier || !currentTier.Loot) {
      toast({
        title: "No Loot Available",
        description: "This tier does not offer any loot.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!currentUser) return;
    try {
      const result = await rollLootSource({
        sourceKind: 'monster',
        categoryId: monster.categoryId,
        monsterName: monster.name,
        tierId: currentTier.id || currentTier.Name || '',
      });
      toast({
        title: result.jackpot ? 'Jackpot found' : 'Loot discovered',
        description: `${result.count} reward${result.count === 1 ? '' : 's'} sent to your discoveries.`,
        status: result.jackpot ? 'success' : 'info',
        duration: 5000,
        isClosable: true,
      });
    } catch (caught: any) {
      toast({ title: 'Loot failed', description: caught?.message || String(caught), status: 'error', duration: 7000, isClosable: true });
    }
  };
  
  return (
    <Flex direction="column" w="100%">
      {/* TOP ROW */}
      <Flex
        w="100%"
        direction={{ base: 'column', md: 'row' }}
        borderBottom="1px solid #444"
      >
        {/* LEFT: Lore */}
        <Box
          width={{ base: '100%', md: '70%' }}
          p={4}
          borderRight={{ base: 'none', md: '1px solid #444' }}
        >
          {monsterName && (
            <Heading size="lg" color="purple.300" mb={4}>
              {monsterName}
            </Heading>
          )}
          {monsterLore && (
            <Box>
              <Heading size="md" color="purple.200" mb={2}>
                Lore
              </Heading>
              <VStack align="stretch" spacing={2}>
                {loreEntries.map(([label, value], index) => index < loreUnlockCount ? (
                  <Text key={label} color="gray.200"><strong>{label}:</strong> {value}</Text>
                ) : (
                  <Box key={label} px={3} py={2} border="1px dashed" borderColor="gray.600" borderRadius="md" bg="blackAlpha.200">
                    <Text color="gray.500" fontSize="sm"><strong>{label}:</strong> Undiscovered — survive another encounter with this creature.</Text>
                  </Box>
                ))}
              </VStack>
              {monster.discoveryManaged && <Text mt={3} color="purple.200" fontSize="xs">Observed in {monster.encounterCount || 0} completed encounter{monster.encounterCount === 1 ? '' : 's'} · {loreUnlockCount}/{loreEntries.length} lore fragments recovered</Text>}
            </Box>
          )}
        </Box>

        {/* RIGHT: Current Tier Image */}
        <Flex
          width={{ base: '100%', md: '30%' }}
          p={4}
          align="center"
          justify="center"
        >
          {currentTier ? (
            <Box textAlign="center">
              <TierImage
                tierName={currentTier.Name ?? `Tier ${displayIndex}`}
                alt={currentTier.Name}
                show={!currentTier.Locked}
              />
              {currentTier.Locked && (
                <Badge mt={2} colorScheme="red">
                  Locked
                </Badge>
              )}
            </Box>
          ) : (
            <Text>No tier selected.</Text>
          )}
        </Flex>
      </Flex>

      {/* BOTTOM: Swiper */}
      <Box p={4}>
        <Swiper
          spaceBetween={20}
          slidesPerView={slidesPerView}
          centeredSlides
          onSlideChange={handleSlideChange}
          initialSlide={0}
          style={{ width: '100%' }}
        >
          {reorderedTiers.map((tier, idx) => {
            const isLocked = tier.Locked === true;
            const blurStyle: React.CSSProperties = isLocked
              ? {
                  filter: 'blur(4px)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }
              : {};

            return (
              <SwiperSlide key={tier.id || idx}>
                <Box
                  p={4}
                  bg={idx === slideIndex ? 'purple.700' : 'gray.700'}
                  borderRadius="md"
                  textAlign="center"
                  transition="background-color 0.3s"
                  position="relative"
                >
                  <Box style={blurStyle}>
                    <Text fontWeight="bold" color="white" noOfLines={1}>
                      {tier.Name || `Tier ${idx + 1}`}
                    </Text>
                    {tier.ChaosTier && <Badge mt={2} colorScheme="pink">Chaos apex · roll every turn</Badge>}
                    {tier.Description && (
                      <Text mt={2} fontSize="sm" color="gray.200">
                        {tier.Description}
                      </Text>
                    )}
                    {tier.Stats && (
                      <Box mt={3} textAlign="left">
                        <Text color="gray.300" fontWeight="bold" mb={2}>
                          Stats:
                        </Text>
                        <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                          {Object.entries(tier.Stats).map(([statKey, statVal]) => (
                            <Box
                              key={statKey}
                              p={2}
                              bg="gray.600"
                              borderRadius="md"
                              border="1px solid"
                              borderColor="gray.500"
                            >
                              <Text color="gray.100" fontWeight="medium">
                                {formatStatKey(statKey)}: {statVal}
                              </Text>
                            </Box>
                          ))}
                        </Grid>
                      </Box>
                    )}
                    {tier.Abilities && tier.Abilities.length > 0 && (
                      <Box mt={2} textAlign="left">
                        <Text color="gray.300" fontWeight="bold">
                          Abilities:
                        </Text>
                        {tier.Abilities.map((ability, i) => (
                          <Text key={i} color="gray.400" fontSize="sm" ml={2}>
                            • {ability}
                          </Text>
                        ))}
                      </Box>
                    )}
                    {tier.ChaosTable && tier.ChaosTable.length > 0 && (
                      <Box mt={4} p={3} bg="blackAlpha.500" border="1px solid" borderColor="pink.300" borderRadius="md" textAlign="left">
                        <Text color="pink.200" fontWeight="bold" mb={1}>Chaos Flux table</Text>
                        <Text color="gray.300" fontSize="xs" mb={3}>Roll at the start of every turn. Unless a result says otherwise, targets are chosen randomly from every eligible creature.</Text>
                        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={2}>
                          {tier.ChaosTable.map((entry) => (
                            <Box key={entry.Roll} p={2} bg="blackAlpha.400" borderRadius="md">
                              <Text color="pink.100" fontSize="sm"><strong>{entry.Roll}.</strong> {entry.Effect}</Text>
                            </Box>
                          ))}
                        </Grid>
                      </Box>
                    )}
                  </Box>
                  {isLocked && (
                    <Box position="absolute" top="8px" right="8px">
                      <Badge colorScheme="red">Locked</Badge>
                    </Box>
                  )}
                </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Box>

      {/* New Loot Button */}
      <Box p={4} textAlign="center">
        <Button colorScheme="blue" onClick={handleLoot} isDisabled={!currentTier || currentTier.Locked}>
          Loot
        </Button>
      </Box>
    </Flex>
  );
};

export default TiersSwiper;
