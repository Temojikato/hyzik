// src/components/NPCImage.tsx
import React, { useEffect, useState } from 'react';
import { Box, Image, Spinner, Icon } from '@chakra-ui/react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../Firebase';
import { FaLock } from 'react-icons/fa';
import { NPCImageFile } from '../types/ResidentCodexTypes';

interface NPCImageProps {
  npcName: string;
  imageFiles: NPCImageFile[];
  locked?: boolean;         // Overall locked state for the NPC
  boxSize?: string;
  currentIndex?: number;
}

const NPCImage: React.FC<NPCImageProps> = ({
  npcName,
  imageFiles,
  locked = false,
  boxSize,
  currentIndex = 0,
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageFile = imageFiles[currentIndex];
        const imageRef = ref(storage, `npcs/${imageFile.filename}`);
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
      } catch (error) {
        console.error('Error fetching NPC image:', error);
        setImageUrl('https://via.placeholder.com/300');
      } finally {
        setLoading(false);
      }
    };
    if (imageFiles && imageFiles.length > 0) {
      fetchImage();
    } else {
      setLoading(false);
    }
  }, [npcName, imageFiles, currentIndex]);

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" width={boxSize || '100%'} height="auto">
        <Spinner size="md" />
      </Box>
    );
  }

  // Determine if this specific image is locked (individual lock OR overall lock)
  const imageLocked = locked || (imageFiles[currentIndex]?.locked ?? false);

  return (
    <Box position="relative" width={boxSize || '100%'} height="auto" overflow="hidden" borderRadius="md">
      <Image
        src={imageUrl}
        alt={npcName}
        width="100%"
        height="auto"
        objectFit="contain"
        filter={imageLocked ? 'blur(8px)' : 'none'}
        transition="filter 0.3s ease-in-out"
      />
      {imageLocked && (
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="rgba(0, 0, 0, 0.4)"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={FaLock} boxSize={8} color="whiteAlpha.800" />
        </Box>
      )}
    </Box>
  );
};

export default NPCImage;
