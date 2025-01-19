// MapPage.tsx

import React, { useState } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import MapSelector from './MapSelector';
import InteractiveMap from './InteractiveMap';
import MapAreaModal from './MapAreaModal';
import { MapFloor, MapArea } from '../mapdata';

const MapPage: React.FC = () => {
  const [selectedFloor, setSelectedFloor] = useState<MapFloor | null>(null);
  const [selectedArea, setSelectedArea] = useState<MapArea | null>(null);

  // Handle unlocking an area by toggling locked = false
  // In a real app, you'd store floors in some global state or context.
  const handleUnlockArea = (areaId: string) => {
    if (!selectedFloor) return;

    const updatedAreas = selectedFloor.areas.map((area) =>
      area.id === areaId ? { ...area, locked: false } : area
    );

    // Set new floor state
    setSelectedFloor({ ...selectedFloor, areas: updatedAreas });

    // Optionally close the modal or re-open it so changes apply
  };

  return (
    <Box p={5} height="100%">
      <Heading size="lg" mb={4}>
        Map Selection
      </Heading>
      {/* Step 1: Category & Floor Selector */}
      <MapSelector onMapSelect={setSelectedFloor} />

      {/* Step 2: Render the map if a floor is selected */}
      {selectedFloor && (
        <Box mt={8} height="calc(100% - 200px)"> {/* Adjust height as needed */}
          <InteractiveMap
            floor={selectedFloor}
            onAreaClick={(area) => setSelectedArea(area)}
          />
        </Box>
      )}

      {/* Step 3: Area Modal when a polygon is clicked */}
      {selectedArea && (
        <MapAreaModal
          area={selectedArea}
          isOpen={true}
          onClose={() => setSelectedArea(null)}
          onUnlock={handleUnlockArea}
        />
      )}
    </Box>
  );
};

export default MapPage;
