import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Badge,
  Heading,
  useBreakpointValue,
  Grid,
  GridItem,
  Button,
  useToast
} from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

import { MonsterTier, MonsterLore, MonsterSpecies } from '../types/BestiaryTypes';
import TierImage from './TierImage';
import { addLootToInventory, rollLoot } from '../utils/lootLogic';
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
  const blurStyleLore: React.CSSProperties = loreLocked
    ? {
        filter: 'blur(4px)',
        pointerEvents: 'none',
        userSelect: 'none',
      }
    : {};

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
    const lootItems = rollLoot(currentTier.Loot);

    await addLootToInventory(lootItems, currentUser!!, toast, setInventory, inventory);
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
            <Box style={blurStyleLore}>
              <Heading size="md" color="purple.200" mb={2}>
                Lore
              </Heading>
              {monsterLore.Formation && (
                <Text color="gray.200" mb={2}>
                  <strong>Formation:</strong> {monsterLore.Formation}
                </Text>
              )}
              {monsterLore['Social Tendencies'] && (
                <Text color="gray.200" mb={2}>
                  <strong>Social Tendencies:</strong> {monsterLore['Social Tendencies']}
                </Text>
              )}
              {monsterLore.Habitat && (
                <Text color="gray.200" mb={2}>
                  <strong>Habitat:</strong> {monsterLore.Habitat}
                </Text>
              )}
              {monsterLore.Behavior && (
                <Text color="gray.200" mb={2}>
                  <strong>Behavior:</strong> {monsterLore.Behavior}
                </Text>
              )}
              {monsterLore.Rarity && (
                <Text color="gray.200" mb={2}>
                  <strong>Rarity:</strong> {monsterLore.Rarity}
                </Text>
              )}
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
        <Button colorScheme="blue" onClick={handleLoot}>
          Loot
        </Button>
      </Box>
    </Flex>
  );
};

export default TiersSwiper;
