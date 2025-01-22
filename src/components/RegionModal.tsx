// src/components/RegionModal.tsx

import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Text,
  Flex,
  IconButton,
  Tooltip,
  useMediaQuery,
} from '@chakra-ui/react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { FaExpand, FaCompress, FaPlus, FaMinus, FaUndo } from 'react-icons/fa';
import { MapRegion, MapArea, MapFloor } from '../mapdata';

interface RegionModalProps {
  region: MapRegion;
  area: MapArea;
  floor: MapFloor;
  isOpen: boolean;
  onClose: () => void;
  /**
   * Reuse the same floorImageUrl from the area modal 
   * so no second fetch is needed
   */
  floorImageUrl: string;
}

const RegionModal: React.FC<RegionModalProps> = ({
  region,
  area,
  floor,
  isOpen,
  onClose,
  floorImageUrl,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  // Auto-focus the region polygon after mount
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        focusOnPolygon(region.polygon);
      }, 200);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function focusOnPolygon(polygon: [number, number][]) {
    if (!transformRef.current || !wrapperRef.current) return;
    // bounding box
    const xs = polygon.map(pt => pt[0]);
    const ys = polygon.map(pt => pt[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const widthBBox = maxX - minX;
    const heightBBox = maxY - minY;
    const centerX = minX + widthBBox / 2;
    const centerY = minY + heightBBox / 2;

    const containerWidth = wrapperRef.current.offsetWidth;
    const containerHeight = wrapperRef.current.offsetHeight;

    const scale = Math.min(containerWidth / widthBBox, containerHeight / heightBBox) * 0.8;
    const translateX = (containerWidth / 2) - (centerX * scale);
    const translateY = (containerHeight / 2) - (centerY * scale);

    transformRef.current.setTransform(translateX, translateY, scale, 300);
  }

  function toggleFullscreen() {
    if (!isFullscreen && wrapperRef.current) {
      wrapperRef.current.requestFullscreen().catch(err => {
        console.error('Error enabling fullscreen in region modal:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }

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

  const handleZoomIn = () => transformRef.current?.zoomIn();
  const handleZoomOut = () => transformRef.current?.zoomOut();
  const handleReset = () => transformRef.current?.resetTransform();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{region.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0}>
          <Flex direction="column" height="100%">
            {/* Region info */}
            <Box p={4} bg="gray.100">
              <Text fontWeight="bold">Region Info:</Text>
              <Text>{region.description || 'No region description.'}</Text>
            </Box>

            {/* Region-level pinch/zoom, reusing floorImageUrl */}
            <Box
              ref={wrapperRef}
              flex="1"
              position="relative"
              width="100%"
              height="100%"
              overflow="hidden"
              display="flex"
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
                    {/* 1) Same floorImageUrl, but we auto-focus on region polygon */}
                    <Box
                      as="img"
                      src={floorImageUrl}
                      alt={`Floor containing region: ${region.name}`}
                      width="100%"
                      height="100%"
                      objectFit="contain"
                      display="block"
                    />

                    {/* 
                      If you want sub-polygons for region-based monsters or items,
                      you'd draw them here. 
                    */}
                  </Box>
                </TransformComponent>
              </TransformWrapper>
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RegionModal;
