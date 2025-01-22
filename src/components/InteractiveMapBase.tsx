// src/components/InteractiveMapBase.tsx

import React, { useRef } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  useMediaQuery,
  Flex,
} from '@chakra-ui/react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { FaExpand, FaCompress, FaPlus, FaMinus, FaUndo } from 'react-icons/fa';

import { MapFloor, MapArea } from '../mapdata';

interface InteractiveMapBaseProps {
  imageUrl: string;
  floor?: MapFloor;
  width?: string | number;
  height?: string | number;
  onAreaClick?: (area: MapArea) => void;
  viewBoxWidth?: number;
  viewBoxHeight?: number;
  showPoints?: boolean;
  showOverlays?: boolean;
  children?: React.ReactNode;
  xStartPoint?: number;
  yStartPoint?: number;
}

const InteractiveMapBase: React.FC<InteractiveMapBaseProps> = ({
  imageUrl,
  floor,
  width = '100%',
  height = '100%',
  onAreaClick,
  viewBoxWidth = 8192,
  viewBoxHeight = 6416,
  showPoints = false,
  showOverlays = false,
  children,
  xStartPoint,
  yStartPoint,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  const mouseDownRef = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseDownRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (
    e: React.MouseEvent,
    areaItem: MapArea,
  ) => {
    if (!mouseDownRef.current) return;

    const { x, y } = mouseDownRef.current;
    const distance = Math.sqrt(
      Math.pow(e.clientX - x, 2) + Math.pow(e.clientY - y, 2)
    );

    // Threshold to distinguish drag from click (e.g., 5px)
    if (distance < 5 && onAreaClick) {
      onAreaClick(areaItem);
    }
    mouseDownRef.current = null;
  };

  const toggleFullscreen = () => {
    if (!isFullscreen && wrapperRef.current) {
      wrapperRef.current.requestFullscreen().catch(err => {
        console.error('Error enabling fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  React.useEffect(() => {
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
    // Implement zoom in functionality if needed
  };
  const handleZoomOut = () => {
    // Implement zoom out functionality if needed
  };
  const handleReset = () => {
    // Implement reset functionality if needed
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
      {/* Fullscreen Toggle on Mobile */}
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

      {/* Zoom Controls if Mobile & Fullscreen */}
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
        initialScale={1}
        minScale={0.5}
        maxScale={10}
        doubleClick={{ disabled: true }}
        wheel={{ step: 0.1 }}
        pinch={{ step: 0.1 }}
      >
        <TransformComponent>
          <Box position="relative" width="100%" height="100%">
            {/* 1) The base floor image */}
            <Box
              as="img"
              src={imageUrl}
              alt="Floor Map"
              width="100%"
              height="100%"
              objectFit="contain"
              display="block"
            />

            {/* 2) Polygons for the floor's areas, if floor is given */}
            {floor && floor.areas && (
              <svg
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                width="100%"
                height="100%"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  pointerEvents: 'none', // Allow panning on empty areas
                }}
                xmlns="http://www.w3.org/2000/svg"
              >
                {floor.areas.map(areaItem => {
                  const points = areaItem.polygon.map(([x, y]) => `${x},${y}`).join(' ');
                  const fillColor = areaItem.color || 'rgba(255,0,0,0.3)';
                  const fillWhenNotOverlay = 'rgba(0,0,0,0.01)'; // Near-transparent fill to capture clicks

                  return (
                    <polygon
                      key={areaItem.id}
                      points={points}
                      fill={showOverlays ? fillColor : fillWhenNotOverlay}
                      stroke="black"
                      strokeWidth={2}
                      style={{
                        cursor: 'pointer',
                        pointerEvents: 'auto', // Capture pointer events
                        transition: 'fill 0.2s, stroke 0.2s',
                      }}
                      onMouseDown={handleMouseDown}
                      onMouseUp={(e) =>
                        handleMouseUp(e, areaItem)
                      }
                      onMouseEnter={(e) => {
                        if (showOverlays) {
                          (e.currentTarget as SVGPolygonElement).style.fill = 'rgba(255,0,0,0.5)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (showOverlays) {
                          (e.currentTarget as SVGPolygonElement).style.fill = fillColor;
                        }
                      }}
                      tabIndex={0}
                      aria-label={`Area ${areaItem.name}`}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (onAreaClick) {
                            onAreaClick(areaItem);
                            console.log(`Area activated via keyboard: ${areaItem.name}`);
                          }
                        }
                      }}
                    />
                  );
                })}
              </svg>
            )}

            {/* 3) If we allow children overlays, render them here */}
            {children}
          </Box>
        </TransformComponent>
      </TransformWrapper>
    </Flex>
  );
};

export default InteractiveMapBase;
