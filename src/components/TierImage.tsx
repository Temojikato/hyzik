// src/components/TierImage.tsx
import React, { useEffect, useState } from 'react';
import { Box, Image, Spinner } from '@chakra-ui/react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../Firebase';

interface TierImageProps {
  tierName: string;  // e.g. "Minor Fire Slime"
  alt?: string;
  boxSize?: string;  // optional: how big the image should be
}

const TierImage: React.FC<TierImageProps> = ({ tierName, alt, boxSize }) => {
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
    return <Spinner size="md" />;
  }

  // If we couldn't find an image or got an error, you might want to show a fallback image
  return (
    <Box>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt || tierName}
          boxSize={boxSize || '300px'}
          objectFit="cover"
        />
      ) : (
        <Image
          src="https://via.placeholder.com/300"
          alt="Fallback"
          boxSize={boxSize || '300px'}
          objectFit="cover"
        />
      )}
    </Box>
  );
};

export default TierImage;
