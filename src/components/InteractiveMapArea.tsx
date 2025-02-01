// src/components/InteractiveMapArea.tsx

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
import { MapArea, MapRegion } from '../mapdata';

interface InteractiveMapAreaProps {
  imageUrl: string;          // The image to display (floor or area image)
  area: MapArea;             // The single area data (including polygon)
  onRegionClick?: (region: MapRegion) => void;
  width?: string | number;
  height?: string | number;

  // Auto-focus props
  autoFocusArea?: boolean;   // default=false
  desiredScale?: number;     // default=2
}

const InteractiveMapArea: React.FC<InteractiveMapAreaProps> = ({
  imageUrl,
  area,
  onRegionClick,
  width = '100%',
  height = '100%',

  autoFocusArea = false,
  desiredScale = 2,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
  }, []);

  // Hide the map until the custom transform is applied
  const [didCustomTransform, setDidCustomTransform] = useState(false);

  // Toggle for showing overlays (if needed)
  const [showOverlays] = useState<boolean>(true);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!isFullscreen && wrapperRef.current) {
      wrapperRef.current.requestFullscreen().catch(err => {
        console.error('Error enabling fullscreen in area:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Listen for fullscreen changes
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

  // Zoom controls
  const handleZoomIn = () => {
    transformRef.current?.zoomIn();
  };
  const handleZoomOut = () => {
    transformRef.current?.zoomOut();
  };
  const handleReset = () => {
    transformRef.current?.resetTransform();
  };

  // Calculate bounding box in floor coordinates
  const xs = area.polygon.map(pt => pt[0]);
  const ys = area.polygon.map(pt => pt[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  /**
   * Auto-focus on the area when the component mounts or when `autoFocusArea` changes.
   * This centers the area in the container at the desired scale.
   */
  useEffect(() => {
    if (!autoFocusArea) {
      setDidCustomTransform(true); // Show map immediately if not focusing
      return;
    }
    setDidCustomTransform(false); // Hide map until transform is applied

    const timer = setTimeout(() => {
      if (!transformRef.current || !wrapperRef.current || !imageRef.current) return;

      const container = wrapperRef.current;
      const img = imageRef.current;

      // Measure the rendered image dimensions
      const renderedImgWidth  = img.clientWidth;
      const renderedImgHeight = img.clientHeight;

      // Prevent division by zero
      if (renderedImgWidth === 0 || renderedImgHeight === 0) {
        console.warn('Rendered image has zero width or height.');
        return;
      }

      // Calculate shrink factors based on objectFit="contain"
      const shrinkFactorX = renderedImgWidth  / dimensions.width;
      const shrinkFactorY = renderedImgHeight / dimensions.height;

      // Calculate bounding box in rendered coordinates
      const renderedMinX = minX * shrinkFactorX;
      const renderedMaxX = maxX * shrinkFactorX;
      const renderedMinY = minY * shrinkFactorY;
      const renderedMaxY = maxY * shrinkFactorY;

      const renderedBBoxWidth  = renderedMaxX - renderedMinX;
      const renderedBBoxHeight = renderedMaxY - renderedMinY;

      // Center of the bounding box in rendered coordinates
      const renderedCenterX = renderedMinX + renderedBBoxWidth / 2;
      const renderedCenterY = renderedMinY + renderedBBoxHeight / 2;

      // Container dimensions
      const w = container.offsetWidth;
      const h = container.offsetHeight;

      // Calculate translation to center the bounding box
      const translateX = (w / 2) - (renderedCenterX * desiredScale);
      const translateY = (h / 2) - (renderedCenterY * desiredScale);

      console.log('InteractiveMapArea => autoFocus debug', {
        minX, maxX, minY, maxY,
        renderedImgWidth, renderedImgHeight,
        shrinkFactorX, shrinkFactorY,
        renderedBBoxWidth, renderedBBoxHeight,
        renderedCenterX, renderedCenterY,
        containerW: w, containerH: h,
        desiredScale,
        translateX, translateY
      });

      // Apply the transform
      transformRef.current.setTransform(translateX, translateY, desiredScale, 0);
      setDidCustomTransform(true);
    }, 300); // Delay to ensure the image has rendered

    return () => clearTimeout(timer);
  }, [
    autoFocusArea,
    desiredScale,
    minX, maxX, minY, maxY,
    dimensions.width, dimensions.height
  ]);

  // Convert the area's polygon to a string suitable for SVG
  const polygonPoints = area.polygon.map(([x, y]) => `${x},${y}`).join(' ');

  return (
    <Flex
      ref={wrapperRef}
      position="relative"
      width={width}
      height={height}
      overflow="hidden"
      flexDirection="column"
      // Hide the map until the transform is applied to prevent flash at scale=1
      style={{ visibility: (!autoFocusArea || didCustomTransform) ? 'visible' : 'hidden' }}
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
            {/* The base area (or floor) image */}
            <Box
              as="img"
              ref={imageRef}
              src={imageUrl}
              alt={`Area: ${area.name}`}
              width="100%"
              height="100%"
              objectFit="contain"
              display="block"
            />

            {/* SVG Overlay for Masking and Highlighting */}
            <svg
              viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
              width="100%"
              height="100%"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
              }}
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 1) Define "expandPolygon" filter & mask => expand polygon by ~15px */}
              <defs>
                <filter id="expandPolygon" x="-50%" y="-50%" width="200%" height="200%">
                  {/* operator="dilate" radius needs to be adjusted based on shrinkFactor to achieve ~15px on screen */}
                  {/* Calculate radius based on current shrinkFactor */}
                  <feMorphology in="SourceGraphic" operator="dilate" radius="150" />
                </filter>

                <mask id="darkMask" maskUnits="userSpaceOnUse" x="0" y="0" width={dimensions.width} height={dimensions.height}>
                  {/* White background: everything is shown (dark overlay applied) */}
                  <rect width="100%" height="100%" fill="white" />

                  {/* Black expanded polygon: masked out (no dark overlay) */}
                  <polygon
                    fill="black"
                    points={polygonPoints}
                    filter="url(#expandPolygon)"
                  />
                </mask>
              </defs>

              {/* 2) The dark overlay with mask applied */}
              <rect
                width="100%"
                height="100%"
                fill="black"
                fillOpacity="0.5"
                mask="url(#darkMask)"
                pointerEvents="none" // Ensure the overlay doesn't block interactions
              />

              {/* 4) Draw sub-region polygons (if any) */}
              {area.regions.map((region) => {
                const regionPoints = region.polygon
                  .map(([rx, ry]) => `${rx},${ry}`)
                  .join(' ');
                return (
                  <polygon
                    key={region.id}
                    points={regionPoints}
                    fill={'transparent'}
                    stroke="black"
                    strokeWidth={2}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRegionClick?.(region);
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

export default InteractiveMapArea;
