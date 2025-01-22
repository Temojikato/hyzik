// src/components/FloorMap.tsx
import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  useMediaQuery,
  Flex,
} from '@chakra-ui/react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { FaExpand, FaCompress, FaPlus, FaMinus, FaUndo } from 'react-icons/fa';

import { MapFloor, MapArea } from '../mapdata';

interface FloorMapProps {
  imageUrl: string; // The final resolved URL for this floor from Firebase
  floor: MapFloor;
  onAreaClick: (area: MapArea) => void;
  onRegionClick?: (regionId: string) => void; // optional if you want region logic
  width?: string | number;
  height?: string | number;
  viewBoxWidth?: number;
  viewBoxHeight?: number;
}

const FloorMap: React.FC<FloorMapProps> = ({
  imageUrl,
  floor,
  onAreaClick,
  width = '100%',
  height = '100%',
  viewBoxWidth = 8192,
  viewBoxHeight = 6416,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error('Error enabling fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFSChange = () => {
      const fsElem = document.fullscreenElement;
      setIsFullscreen(!!fsElem && fsElem === containerRef.current);
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFSChange);
    };
  }, []);

  const handleZoomIn = () => transformRef.current?.zoomIn();
  const handleZoomOut = () => transformRef.current?.zoomOut();
  const handleReset = () => transformRef.current?.resetTransform();

  return (
    <Flex
      ref={containerRef}
      position="relative"
      width={width}
      height={height}
      overflow="hidden"
      flexDirection="column"
    >
      {/* Fullscreen Button */}
      {isMobile && (
        <Tooltip label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
          <IconButton
            icon={isFullscreen ? <FaCompress /> : <FaExpand />}
            onClick={toggleFullscreen}
            position="absolute"
            top="10px"
            right="10px"
            zIndex={1000}
            aria-label="Toggle Fullscreen"
          />
        </Tooltip>
      )}

      {/* Zoom Controls if mobile & fullscreen */}
      {isMobile && isFullscreen && (
        <Box
          position="absolute"
          bottom="10px"
          right="10px"
          zIndex={1000}
          display="flex"
          flexDirection="column"
          gap="10px"
        >
          <IconButton icon={<FaPlus />} aria-label="Zoom In" onClick={handleZoomIn} />
          <IconButton icon={<FaMinus />} aria-label="Zoom Out" onClick={handleZoomOut} />
          <IconButton icon={<FaUndo />} aria-label="Reset Zoom" onClick={handleReset} />
        </Box>
      )}

      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.5}
        maxScale={10}
        doubleClick={{ disabled: true }}
        wheel={{ step: 0.1 }}
        pinch={{ step: 0.1 }}
      >
        <TransformComponent>
          <Box position="relative" width="100%" height="100%">
            {/* The floor's base image */}
            <Box
              as="img"
              src={imageUrl}
              alt={`Floor: ${floor.name}`}
              width="100%"
              height="100%"
              objectFit="contain"
              display="block"
            />
            {/* Polygons for areas */}
            <svg
              viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              width="100%"
              height="100%"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
              }}
              xmlns="http://www.w3.org/2000/svg"
            >
              {floor.areas.map((areaItem, index) => {
                const pointsString = areaItem.polygon
                  .map(([x, y]) => `${x},${y}`)
                  .join(' ');
                const fillColor = areaItem.color || 'rgba(255,0,0,0.3)';

                return (
                  <polygon
                    key={areaItem.id}
                    points={pointsString}
                    fill={fillColor}
                    stroke="black"
                    strokeWidth={2}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAreaClick(areaItem);
                    }}
                  />
                );
              })}
            </svg>
          </Box>
        </TransformComponent>
      </TransformWrapper>
    </Flex>
  );
};

export default FloorMap;
