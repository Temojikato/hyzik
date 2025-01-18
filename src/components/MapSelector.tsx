// MapSelector.tsx
import React, { useState } from 'react';
import { VStack, Select, Text } from '@chakra-ui/react';
import { mapData, MapCategory, MapFloor } from '../mapdata';

interface MapSelectorProps {
  onMapSelect: (floor: MapFloor) => void;
}

const MapSelector: React.FC<MapSelectorProps> = ({ onMapSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<MapCategory | null>(null);

  const handleCategoryChange = (categoryId: string) => {
    const found = mapData.find((cat: MapCategory) => cat.id === categoryId) || null;
    setSelectedCategory(found);
  };

  const handleFloorChange = (floorId: string) => {
    if (!selectedCategory) return;
    const foundFloor = selectedCategory.floors.find((floor: MapFloor) => floor.id === floorId);
    if (foundFloor) {
      onMapSelect(foundFloor);
    }
  };

  return (
    <VStack align="start">
      <Text fontWeight="bold">Select Category:</Text>
      <Select placeholder="-- Choose --" onChange={(e) => handleCategoryChange(e.target.value)}>
        {mapData.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>

      {selectedCategory && (
        <>
          <Text fontWeight="bold">Select Floor:</Text>
          <Select placeholder="-- Choose Floor --" onChange={(e) => handleFloorChange(e.target.value)}>
            {selectedCategory.floors.map((floor) => (
              <option key={floor.id} value={floor.id}>
                {floor.name}
              </option>
            ))}
          </Select>
        </>
      )}
    </VStack>
  );
};

export default MapSelector;
