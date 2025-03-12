// src/components/InteractiveMapRegionTown.tsx
import React from 'react';
import { Box, IconButton, Image, Flex } from '@chakra-ui/react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface InteractiveMapRegionTownProps {
  images: string[];
}

const InteractiveMapRegionTown: React.FC<InteractiveMapRegionTownProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (!images || images.length === 0) {
    return <Box>No images available.</Box>;
  }

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      position="relative"
      height="100%"
      bg="gray.200"
    >
      <Box width="70%" position="relative" overflow="hidden">
        <Image
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          objectFit="contain"
          maxH="60vh"
          margin="0 auto"
          display="block"
          borderRadius="md"
        />
      </Box>

      {/* Navigation Arrows */}
      <Flex position="absolute" top="50%" width="100%" justifyContent="space-between" px={4}>
        <IconButton
          aria-label="Previous image"
          icon={<FaArrowLeft />}
          onClick={goPrev}
          variant="solid"
        />
        <IconButton
          aria-label="Next image"
          icon={<FaArrowRight />}
          onClick={goNext}
          variant="solid"
        />
      </Flex>
    </Flex>
  );
};

export default InteractiveMapRegionTown;
