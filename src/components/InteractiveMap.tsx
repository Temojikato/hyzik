// InteractiveMap.tsx
import React, { useEffect, useState } from 'react';
import { Box, Image, Spinner } from '@chakra-ui/react';
import { MapFloor, MapArea } from '../mapdata';
import { getDownloadURL } from 'firebase/storage';
import { ref } from 'firebase/storage';
import { storage } from '../Firebase';

interface InteractiveMapProps {
  floor: MapFloor;
  onAreaClick: (area: MapArea) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ floor, onAreaClick }) => {

  const [imageUrl, setImageUrl] = useState<string>('placeholder-image.png');
  const [loadingImage, setLoadingImage] = useState<boolean>(true);


  useEffect(() => {
    const fetchImage = async () => {
      if (floor) {
        try {
          const imageRef = ref(storage, "maps/" + floor.name + ".jpg");
          const url = await getDownloadURL(imageRef);
          setImageUrl(url);
        } catch (error) {
          console.error('Error fetching item image:', error);
        }
      }
      setLoadingImage(false);
    };

    fetchImage();
  }, [floor]);

  return (
    <Box position="relative">
      {/* Base map image */}
      {loadingImage ? (
        <Spinner size="md" />
      ) : (
        <Image
        src={imageUrl}
        alt={floor.name}
        width="120%"
        height="120%"
        objectFit="contain"
      />
      )}


      {/* SVG Overlay */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {floor.areas.map((area: MapArea) => {
          // Build a string like "100,150 200,150 200,220 100,220"
          const pointsString = area.polygon
            .map(([x, y]) => `${x},${y}`)
            .join(' ');

          return (
            <polygon
              key={area.id}
              points={pointsString}
              fill="transparent"
              stroke="red"
              strokeWidth={2}
              // Let the polygon receive pointer events
              style={{ cursor: 'pointer', pointerEvents: 'auto' }}
              onClick={(e) => {
                e.stopPropagation(); // in case there's a parent click
                onAreaClick(area);
              }}
            />
          );
        })}
      </svg>
    </Box>
  );
};

export default InteractiveMap;
