// src/components/InteractiveMapRegion.tsx
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
import { MapRegion } from '../mapdata';

/**
 * Maybe your Region has a dedicated detailed image,
 * or you still use the same floor/area image. Up to you.
 */
interface InteractiveMapRegionProps {
  imageUrl: string;  // region-specific or same floor image
  region: MapRegion; // The single region
  width?: string | number;
  height?: string | number;

  // Possibly you have further sub-things (monsters, items)
  // We skip them here for brevity.
}

const InteractiveMapRegion: React.FC<InteractiveMapRegionProps> = ({
  imageUrl,
  region,
  width = '100%',
  height = '100%',
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  const toggleFullscreen = () => {
    if (!isFullscreen && wrapperRef.current) {
      wrapperRef.current.requestFullscreen().catch(err => {
        console.error('Error enabling fullscreen in region:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFSChange = () => {
      const fsElem = document.fullscreenElement;
      setIsFullscreen(!!fsElem && fsElem === wrapperRef.current);
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFSChange);
    };
  }, []);

  const handleZoomIn = () => {
    transformRef.current?.zoomIn();
  };
  const handleZoomOut = () => {
    transformRef.current?.zoomOut();
  };
  const handleReset = () => {
    transformRef.current?.resetTransform();
  };

  return (
    <Flex
      ref={wrapperRef}
      position="relative"
      width={width}
      height={height}
      overflow="hidden"
      flexDirection="column"
    >
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
            {/* 1) Region image (or same area/floor image) */}
            <Box
              as="img"
              src={imageUrl}
              alt={`Region: ${region.name}`}
              width="100%"
              height="100%"
              objectFit="contain"
              display="block"
            />

            {/* 2) Additional polygons for monsters/items? */}
            {/* e.g. we skip in this example */}
          </Box>
        </TransformComponent>
      </TransformWrapper>
    </Flex>
  );
};

export default InteractiveMapRegion;
