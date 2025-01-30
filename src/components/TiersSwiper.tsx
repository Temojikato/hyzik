import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Badge, Heading } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

import { MonsterTier, MonsterLore } from '../types/BestiaryTypes';
import TierImage from './TierImage';

interface TiersSwiperProps {
  monsterName?: string;
  monsterLore?: MonsterLore;
  loreLocked: boolean;
  tiers: MonsterTier[];
}

const TiersSwiper: React.FC<TiersSwiperProps> = ({
  monsterName,
  monsterLore,
  loreLocked,
  tiers,
}) => {
  /** We store a reordered array in state so we can put the selected tier first. */
  const [reorderedTiers, setReorderedTiers] = useState<MonsterTier[]>([]);
  // Keep track of the Swiper’s active index (slideIndex) and the displayed index (if you’re still preventing locked updates).
  const [slideIndex, setSlideIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  
  const blurStyleLore: React.CSSProperties = loreLocked
    ? {
        filter: 'blur(4px)',
        pointerEvents: 'none',
        userSelect: 'none',
      }
    : {};

  // The tier shown in the top image area
  const currentTier = reorderedTiers[displayIndex] || null;

  /**
   * On mount or whenever `tiers` changes:
   *  - Find the first UNLOCKED tier
   *  - Move it to the front of the array
   *  - Start the swiper at index 0
   */
  useEffect(() => {
    if (!tiers || tiers.length === 0) {
      setReorderedTiers([]);
      setSlideIndex(0);
      setDisplayIndex(0);
      return;
    }

    const newArr = [...tiers];
    // Find first UNLOCKED tier
    const firstUnlockedIdx = newArr.findIndex(t => !t.Locked);

    if (firstUnlockedIdx > 0) {
      // Remove that tier from its position...
      const [unlockedTier] = newArr.splice(firstUnlockedIdx, 1);
      // ...and insert it at the front
      newArr.unshift(unlockedTier);

      setSlideIndex(0);
      setDisplayIndex(0);
    } else {
      // If the first tier is already unlocked at index 0,
      // or all are locked (firstUnlockedIdx === -1), we do nothing special
      setSlideIndex(Math.max(0, firstUnlockedIdx));
      setDisplayIndex(Math.max(0, firstUnlockedIdx));
    }

    setReorderedTiers(newArr);
  }, [tiers]);

  // Swiper slide change logic (if you still want to block locked updates)
  const handleSlideChange = (swiper: SwiperType) => {
    const newIdx = swiper.activeIndex;
    setSlideIndex(newIdx);

    const newTier = reorderedTiers[newIdx];
    // If not locked, update the displayed tier
    if (newTier && !newTier.Locked) {
      setDisplayIndex(newIdx);
    }
  };

  return (
    <Flex direction="column" w="100%" h="100%">
      {/* TOP ROW */}
      <Flex
        flex="0 0 60%"
        w="100%"
        borderBottom="1px solid #444"
        direction={{ base: 'column', md: 'row' }}
      >
        {/* LEFT: monster info */}
        <Box
          width={{ base: '100%', md: '70%' }}
          p={4}
          overflowY="auto"
          borderRight={{ base: "none", md: "1px solid #444" }}
        >
          {monsterName && (
            <Heading size="lg" color="purple.300" mb={4}>
              {monsterName}
            </Heading>
          )}
          {monsterLore && (
            <Box style={blurStyleLore}>
              <Heading size="md" color="purple.200" mb={2}>Lore</Heading>
              {monsterLore.Formation && (
                <Text color="gray.200" mb={2}>
                  <strong>Formation:</strong> {monsterLore.Formation}
                </Text>
              )}
              {monsterLore['Social Tendencies'] && (
                <Text color="gray.200">
                  <strong>Social Tendencies:</strong> {monsterLore['Social Tendencies']}
                </Text>
              )}
            </Box>
          )}
        </Box>

        {/* RIGHT: top-tier image */}
        <Flex
          width={{ base: '100%', md: '30%' }}
          p={4}
          align="center"
          justify="center"
          borderLeft={{ base: "none", md: "1px solid #444" }}
        >
          {currentTier ? (
            <Box textAlign="center">
              <TierImage
                tierName={currentTier.Name ?? `Tier${displayIndex}`}
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
      <Box flex="1" p={4} overflowY="auto">
        <Swiper
          spaceBetween={20}
          slidesPerView={1.4}
          centeredSlides
          onSlideChange={handleSlideChange}
          initialSlide={0} // We forcibly place the first unlocked tier at index 0
          style={{ width: '100%', height: '100%' }}
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
                  height="100%"
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
                      <Box mt={2} textAlign="left">
                        <Text color="gray.300" fontWeight="bold">
                          Stats:
                        </Text>
                        {Object.entries(tier.Stats).map(([statKey, statVal]) => (
                          <Text key={statKey} color="gray.400">
                            {statKey}: {statVal}
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
    </Flex>
  );
};

export default TiersSwiper;
