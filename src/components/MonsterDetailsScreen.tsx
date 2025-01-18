// MonsterDetailsScreen.tsx
import React, { useState } from 'react';
import { Box, Text, Heading, Badge } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

import { MonsterTier } from '../types/BestiaryTypes';
import TierImage from './TierImage';

interface MonsterLore {
  Formation?: string;
  'Social Tendencies'?: string;
}

// Example monster interface (simplified)
interface MonsterDoc {
  name: string;
  Lore?: MonsterLore;
  Tiers?: MonsterTier[]; // assume an array for simplicity
}

interface MonsterDetailsScreenProps {
  monster: MonsterDoc;
}

const MonsterDetailsScreen: React.FC<MonsterDetailsScreenProps> = ({ monster }) => {
  const tiers = monster.Tiers || [];

  // Keep track of the selected tier (index) for the carousel
  const [selectedIndex, setSelectedIndex] = useState(0);

  // The currently active tier
  const currentTier = tiers[selectedIndex] || null;

  return (
    <Box 
      width="90vw"  // 90% of viewport width
      height="90vh" // 90% of viewport height
      margin="auto" // center horizontally
      display="flex"
      flexDirection="column"
      bg="gray.900"
      color="gray.100"
    >
      {/* TOP ROW: 30% height, split into 70% left / 30% right */}
      <Box flex="0 0 30%" display="flex" width="100%" borderBottom="1px solid #444">
        
        {/* LEFT (70%) - Basic info + Lore */}
        <Box width="70%" p={4} overflowY="auto">
          <Heading size="lg" color="purple.300" mb={3}>
            {monster.name}
          </Heading>
          
          {monster.Lore && (
            <Box>
              <Heading size="md" color="purple.200" mb={2}>Lore</Heading>
              {monster.Lore.Formation && (
                <Text color="gray.200" mb={2}>
                  <strong>Formation:</strong> {monster.Lore.Formation}
                </Text>
              )}
              {monster.Lore['Social Tendencies'] && (
                <Text color="gray.200">
                  <strong>Social Tendencies:</strong> {monster.Lore['Social Tendencies']}
                </Text>
              )}
            </Box>
          )}
        </Box>

        {/* RIGHT (30%) - Tier (or monster) image */}
        <Box width="30%" p={4} borderLeft="1px solid #444" display="flex" justifyContent="center" alignItems="center">
          {currentTier ? (
            <Box textAlign="center">
              {/* If you want the top-right image to show the CURRENT TIER's image: */}
              <TierImage
                tierName={currentTier.Name || `Tier${selectedIndex}`}
                alt={currentTier.Name}
              />
              
              {/* Tier Lock Status */}
              {currentTier.locked && (
                <Badge mt={2} colorScheme="red">Locked</Badge>
              )}
            </Box>
          ) : (
            <Text>No Tiers Selected</Text>
          )}
        </Box>
      </Box>

      {/* BOTTOM ROW: 70% height for the Tiers Carousel */}
      <Box flex="1" p={4} overflowY="auto">
        <Swiper
          spaceBetween={20}
          slidesPerView={3}
          centeredSlides={false}
          onSlideChange={(swiper: SwiperType) => setSelectedIndex(swiper.activeIndex)}
          style={{ width: '100%', height: '100%' }}
        >
          {tiers.map((tier, idx) => (
            <SwiperSlide key={tier.id || idx}>
              <Box
                p={4}
                bg={idx === selectedIndex ? 'purple.700' : 'gray.700'}
                borderRadius="md"
                textAlign="center"
                transition="background-color 0.3s"
                height="100%"
              >
                <Text fontWeight="bold" color="white" noOfLines={1}>
                  {tier.Name || `Tier ${idx + 1}`}
                </Text>
                {tier.locked && <Badge colorScheme="red">Locked</Badge>}
                {tier.Description && (
                  <Text mt={2} fontSize="sm" color="gray.200">
                    {tier.Description}
                  </Text>
                )}
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};


export default MonsterDetailsScreen;
