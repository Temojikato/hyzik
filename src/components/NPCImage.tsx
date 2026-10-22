import React, { useEffect, useState } from 'react';
import { Box, Image, Spinner, Icon, Text } from '@chakra-ui/react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../Firebase';
import { FaLock } from 'react-icons/fa';
import { NPCImageFile } from '../types/ResidentCodexTypes';

interface NPCImageProps {
  npcName: string;
  imageFiles: NPCImageFile[];
  locked?: boolean;
  boxSize?: string;
  currentIndex?: number;
  fallbackUrl?: string;
}

const NPCImage: React.FC<NPCImageProps> = ({
  npcName, imageFiles, locked = false, boxSize, currentIndex = 0, fallbackUrl,
}) => {
  const filename = imageFiles[currentIndex]?.filename;
  // Legacy records contain example.com URLs. Missing art uses a local fallback.
  const usableFallback = fallbackUrl && !/example\.com|via\.placeholder\.com|placehold\.co/i.test(fallbackUrl)
    ? fallbackUrl : '';
  const sourceKey = JSON.stringify([filename, usableFallback]);
  const [source, setSource] = useState({ key: '', url: '', loading: false });

  useEffect(() => {
    let cancelled = false;
    setSource({ key: sourceKey, url: '', loading: Boolean(filename) });
    if (filename) {
      getDownloadURL(ref(storage, `npcs/${filename}`))
        .then(url => {
          if (!cancelled) setSource({ key: sourceKey, url, loading: false });
        })
        .catch(() => {
          if (!cancelled) setSource({ key: sourceKey, url: usableFallback, loading: false });
        });
    } else {
      setSource({ key: sourceKey, url: usableFallback, loading: false });
    }
    return () => { cancelled = true; };
  }, [filename, usableFallback, sourceKey]);

  const loading = source.key !== sourceKey ? Boolean(filename) : source.loading;
  const imageUrl = source.key === sourceKey ? source.url : '';
  const imageLocked = locked || (imageFiles[currentIndex]?.locked ?? false);
  const initials = npcName.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('');
  const placeholder = (
    <Box role="img" aria-label={`Portrait unavailable for ${npcName}`} bg="surfaceRaised"
      minH="80px" w="100%" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Text color="textMuted" fontWeight="bold" fontSize="xl">{initials || '?'}</Text>
    </Box>
  );

  return (
    <Box position="relative" width={boxSize || '100%'} overflow="hidden" borderRadius="md">
      <Box filter={imageLocked ? 'blur(8px)' : 'none'}>
        {loading ? (
          <Box minH="80px" display="flex" alignItems="center" justifyContent="center"><Spinner size="md" /></Box>
        ) : imageUrl ? (
          <Image src={imageUrl} alt={npcName} width="100%" height="auto" objectFit="contain" fallback={placeholder} />
        ) : placeholder}
      </Box>
      {imageLocked && (
        <Box position="absolute" inset={0} bg="blackAlpha.500" display="flex" alignItems="center" justifyContent="center">
          <Icon as={FaLock} boxSize={8} color="whiteAlpha.800" aria-label="Portrait locked" />
        </Box>
      )}
    </Box>
  );
};

export default NPCImage;
