// src/components/TierImage.tsx

import React, { useEffect, useState } from 'react';
import { Box, Image, Spinner } from '@chakra-ui/react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../Firebase';

interface TierImageProps {
  tierName: string;  // e.g. "Minor Fire Slime"
  alt?: string;
  boxSize?: string;  // optional: how big the image should be
  show?: boolean;
}

const TierImage: React.FC<TierImageProps> = ({ tierName, alt, boxSize, show = true }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageRef = ref(storage, `monsters/${tierName}.png`);
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
      } catch (error) {
        console.error('Error fetching monster tier image:', error);
      } finally {
        setLoading(false);
      }
    };
    if (tierName) {
      fetchImage();
    } else {
      setLoading(false);
    }
  }, [tierName]);

  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxSize={boxSize || '300px'}
      >
        <Spinner size="md" />
      </Box>
    );
  }

  // If we couldn't find an image or got an error, show a fallback image
  return (
    <Box
      boxSize={boxSize || '300px'}
      overflow="hidden"
      borderRadius="md"
      position="relative"
    >
      <Image
        src={imageUrl || 'https://via.placeholder.com/300'}
        alt={alt || tierName}
        boxSize="100%"
        objectFit="cover"
        filter={!show ? 'blur(15px)' : 'none'} // Apply extreme blur when show is false
        transition="filter 0.3s ease-in-out" // Smooth transition
      />
      {/* Optional: Add an overlay or icon when blurred */}
      {!show && (
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="rgba(0, 0, 0, 0.2)" // Semi-transparent overlay
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="lg" color="whiteAlpha.700" />
        </Box>
      )}
    </Box>
  );
};

export default TierImage;
