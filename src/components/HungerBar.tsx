// src/components/HungerBar.tsx
import React from 'react';
import {
  Box,
  Progress,
  Text,
  VStack,
  usePrefersReducedMotion,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

interface HungerBarProps {
  currentHunger: number;
  maxHunger?: number;
}

/** Spasm animation for overflow > 100% */
const spasmKeyframes = keyframes`
  0%   { transform: scale(1)   translate(0,0)        rotate(0deg); }
  12%  { transform: scale(1.3) translate(20px, -10px) rotate(10deg); }
  25%  { transform: scale(0.8) translate(-30px, 15px) rotate(-5deg); }
  37%  { transform: scale(1.4) translate(10px, 20px)  rotate(8deg); }
  50%  { transform: scale(1)   translate(-10px, -5px) rotate(3deg); }
  62%  { transform: scale(1.5) translate(25px, 5px)   rotate(-10deg); }
  75%  { transform: scale(0.9) translate(-15px, 10px) rotate(6deg); }
  87%  { transform: scale(1.4) translate(10px, -15px) rotate(-6deg); }
  100% { transform: scale(1)   translate(0,0)         rotate(0deg); }
`;

/** Gentle blink when totalPercent < 30% */
const blinkKeyframes = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.7; }
`;

/** 
 * 0→100: red->green
 * 100→199: green->blue
 * ≥200: black
 */
function interpolateColor(totalPercent: number): string {
  if (totalPercent <= 0) return 'red';
  if (totalPercent <= 100) {
    // red->green (HSL)
    const hue = (120 * totalPercent) / 100; // 0..120
    return `hsl(${hue}, 100%, 50%)`;
  }
  if (totalPercent < 200) {
    // green->blue
    const factor = (totalPercent - 100) / 99;
    const g = 255 * (1 - factor);
    const b = 255 * factor;
    return `rgb(0, ${Math.round(g)}, ${Math.round(b)})`;
  }
  // 200+ => black
  return 'black';
}

/** For >100%, shorter spasm duration the more we overflow */
function calcSpasmDuration(totalPercent: number): number {
  if (totalPercent <= 100) return 0;
  const overflow = Math.min(totalPercent - 100, 100);
  return 1 - (overflow / 100) * 0.7; // 1s→0.3s
}

const HungerBar: React.FC<HungerBarProps> = ({
  currentHunger,
  maxHunger = 100,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const totalPercent = (currentHunger / maxHunger) * 100;
  const basePercent = Math.min(totalPercent, 100);  // top bar
  const overflowPercent = totalPercent > 100 ? totalPercent : 0; // bottom bar
  const fillColor = interpolateColor(totalPercent);

  // BOTTOM bar spasm if >100
  let bottomBarStyle: React.CSSProperties = {};
  if (!prefersReducedMotion && overflowPercent > 100) {
    const spasmDuration = calcSpasmDuration(totalPercent);
    if (spasmDuration > 0) {
      bottomBarStyle = {
        animation: `${spasmKeyframes} ${spasmDuration}s infinite`,
        transformOrigin: '50% 50%',
      };
    }
  }

  // TOP bar blinking if <30%
  let topBarBlinkStyle: React.CSSProperties = {};
  if (!prefersReducedMotion && totalPercent < 30 && totalPercent > 0) {
    topBarBlinkStyle = {
      animation: `${blinkKeyframes} 1s infinite ease-in-out`,
    };
  }

  return (
    <VStack align="stretch" spacing={1} w="full" position="relative">
      <Text fontWeight="bold">Hunger</Text>

      {/* Outer container: 30px tall. We place label inside it as well. */}
      <Box position="relative" w="full" h="30px" overflow="visible">
        {/* BOTTOM BAR only if totalPercent>100 */}
        {overflowPercent > 100 && (
          <Progress
            value={overflowPercent}
            max={200}
            position="absolute"
            top="0"
            left="0"
            h="30px"
            borderRadius="md"
            w={`${overflowPercent}%`}
            sx={{
              background: 'transparent !important',
              '& .chakra-progress__track': {
                background: 'transparent !important',
              },
              '& > div:first-of-type': {
                background: fillColor,
                ...bottomBarStyle,
              },
            }}
          />
        )}

        {/* TOP BAR up to 100%, offset down by 5px, narrower (20px height) */}
        <Progress
          value={basePercent}
          max={100}
          position="absolute"
          left="0"
          top="5px"
          h="20px"
          borderRadius="md"
          w={`${basePercent}%`}
          sx={{
            background: 'transparent !important',
            '& .chakra-progress__track': {
              background: 'transparent !important',
            },
            '& > div:first-of-type': {
              background: fillColor,
              ...topBarBlinkStyle,
            },
          }}
        />

        {/* LABEL: always visible, centered */}
        <Box
          position="absolute"
          top="0"
          left="50%"
          transform="translateX(-50%)"
          zIndex="overlay"
          height="30px"
          display="flex"
          alignItems="center"
        >
          <Text fontWeight="bold" fontSize="sm" color="white">
            {currentHunger}/{maxHunger}
          </Text>
        </Box>
      </Box>
    </VStack>
  );
};

export default HungerBar;
