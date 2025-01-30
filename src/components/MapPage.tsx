// src/components/MapPage.tsx

import React, { useEffect, useState } from 'react';
import { Box, Heading, Flex, Spinner, Text } from '@chakra-ui/react';
import MapSelector from './MapSelector';
import MapAreaModal from './MapAreaModal';
import { MapFloor, MapArea } from '../mapdata';
import { storage } from '../Firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import InteractiveMapBase from './InteractiveMapBase';

const MapPage: React.FC = () => {
  const [selectedFloor, setSelectedFloor] = useState<MapFloor | null>(null);
  const [selectedArea, setSelectedArea] = useState<MapArea | null>(null);

  const [floorImageUrl, setFloorImageUrl] = useState<string>('');
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  function handleFloorSelect(floor: MapFloor) {
    setSelectedFloor(floor);
    setSelectedArea(null);

    setLoadingImage(true);
    setImageError(false);

    // Single fetch for the entire floor's image
    const imageRef = ref(storage, "maps/" + floor.name + ".jpg");
    getDownloadURL(imageRef)
      .then((url) => {
        setFloorImageUrl(url);
        setLoadingImage(false);
      })
      .catch((error) => {
        console.error('Error fetching map image:', error);
        setFloorImageUrl('');
        setLoadingImage(false);
        setImageError(true);
      });
  }

  function handleAreaClick(area: MapArea) {
    // Open the area modal
    setSelectedArea(area);
  }

  useEffect(() => {
    if (selectedArea) {
      console.log("selectedArea changed =>", selectedArea);
    }
  }, [selectedArea]);

  
  return (
    <Box p={5} height="100vh">
      <Heading size="lg" mb={4}>Map Selection</Heading>
      <MapSelector onMapSelect={handleFloorSelect} />

      {selectedFloor && (
        <Box mt={8} height="calc(100% - 200px)" position="relative">
          {loadingImage ? (
            <Flex align="center" justify="center" height="100%">
              <Spinner size="xl" />
            </Flex>
          ) : imageError ? (
            <Flex align="center" justify="center" height="100%">
              <Text color="red.500">Failed to load map image.</Text>
            </Flex>
          ) : floorImageUrl ? (
            <InteractiveMapBase
              imageUrl={floorImageUrl}
              width="100%"
              height="100%"
              onAreaClick={handleAreaClick}
              floor={selectedFloor}
            />
          ) : null}
        </Box>
      )}

      {/* Open the area modal if an area is selected */}
      {selectedArea && selectedFloor && (
        <MapAreaModal
          area={selectedArea}
          isOpen={!!selectedArea}
          onClose={() => setSelectedArea(null)}
          floor={selectedFloor}

          // Pass the EXACT same floorImageUrl we loaded
          floorImageUrl={floorImageUrl}
        />
      )}
    </Box>
  );
};

export default MapPage;
