// InteractiveMap.tsx

import React, { useEffect, useState, useRef } from 'react';
import {
  ReactSVGPanZoom,
  TOOL_NONE,
  Tool,
} from 'react-svg-pan-zoom';
import {
  Box,
  Image,
  Spinner,
  Button,
  useMediaQuery,
  Flex,
} from '@chakra-ui/react';
import { MapFloor, MapArea } from '../mapdata';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../Firebase';
import '../InteractiveMap.css'; // Ensure this CSS file exists for hover effects
import { useWindowSize } from 'react-use'; // Install react-use or use your own hook

interface InteractiveMapProps {
  floor: MapFloor;
  onAreaClick: (area: MapArea) => void;
}

const colorPalette: string[] = [
  'rgba(255, 0, 0, 0.3)',    // Red
  'rgba(0, 255, 0, 0.3)',    // Green
  'rgba(0, 0, 255, 0.3)',    // Blue
  'rgba(255, 165, 0, 0.3)',  // Orange
  'rgba(128, 0, 128, 0.3)',  // Purple
  'rgba(0, 255, 255, 0.3)',  // Cyan
  'rgba(255, 192, 203, 0.3)',// Pink
  'rgba(128, 128, 128, 0.3)',// Gray
  // Add more colors as needed
];

const InteractiveMap: React.FC<InteractiveMapProps> = ({ floor, onAreaClick }) => {
  const [imageUrl, setImageUrl] = useState<string>('placeholder-image.png');
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const [showPoints, setShowPoints] = useState<boolean>(false); // Toggle to show/hide points
  const [showOverlays, setShowOverlays] = useState<boolean>(false); // Toggle to show/hide color overlays
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false); // Fullscreen state
  const Viewer = useRef<any>(null); // Using 'any' due to lack of exported type
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the map container

  // Detect if the screen width is less than or equal to 768px (commonly used breakpoint for mobile)
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  const { width, height } = useWindowSize(); // Get current window dimensions

  // Viewer state management for ReactSVGPanZoom
  const [viewerValue, setViewerValue] = useState<any>({}); // Initialize with empty object or appropriate initial state
  const [viewerTool, setViewerTool] = useState<Tool>(TOOL_NONE);

  useEffect(() => {
    const fetchImage = async () => {
      if (floor) {
        try {
          const imageRef = ref(storage, "maps/" + floor.name + ".jpg");
          const url = await getDownloadURL(imageRef);
          setImageUrl(url);
        } catch (error) {
          console.error('Error fetching map image:', error);
          // Optionally, set an error state here to display an error message
        }
      }
      setLoadingImage(false);
    };

    fetchImage();
  }, [floor]);

  // Handle Fullscreen Toggle using Browser API
  const toggleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Listen for fullscreen change events to update state
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fsElement = document.fullscreenElement;
      setIsFullscreen(!!fsElement && fsElement === containerRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Define zoom/pan controls only when in fullscreen mode on mobile
  const enablePanAndZoom = isMobile && isFullscreen;

  // External Zoom Controls (optional)
  const handleZoomIn = () => {
    if (Viewer.current && typeof Viewer.current.zoomIn === 'function') {
      Viewer.current.zoomIn();
    } else {
      console.error('zoomIn method is not available on Viewer.current');
    }
  };

  const handleZoomOut = () => {
    if (Viewer.current && typeof Viewer.current.zoomOut === 'function') {
      Viewer.current.zoomOut();
    } else {
      console.error('zoomOut method is not available on Viewer.current');
    }
  };

  const handleReset = () => {
    if (Viewer.current && typeof Viewer.current.reset === 'function') {
      Viewer.current.reset();
    } else {
      console.error('reset method is not available on Viewer.current');
    }
  };

  return (
    <Flex
      ref={containerRef}
      position="relative"
      width="100%"
      height={isFullscreen ? '100vh' : { base: '60vh', md: '80vh' }} // Responsive heights
      overflow="hidden"
      flexDirection="column"
    >
      {/* Toggle Buttons Container */}
      {isMobile && (
        <Box
          position="fixed" // Changed to 'fixed' to keep buttons visible
          top="10px"
          right="10px"
          zIndex="1000" // Increased zIndex to stay above other elements
          display="flex"
          flexDirection="column"
          gap="10px"
        >
          {/* Fullscreen Toggle Button */}
          <Button
            size="m"
            onClick={toggleFullscreen}
            backgroundColor="rgba(255, 255, 255, 0.8)"
            border="none"
            borderRadius="4px"
            cursor="pointer"
            marginTop="23rem"
            boxShadow="md"
            aria-label={isFullscreen ? 'Exit Fullscreen Mode' : 'Enter Fullscreen Mode'}
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>

        </Box>
      )}

      {/* External Zoom Controls */}
      {enablePanAndZoom && (
        <Box
          position="fixed" // Changed to 'fixed' to keep buttons visible
          bottom="10px"
          right="10px"
          zIndex="1000" // Increased zIndex to stay above other elements
          display="flex"
          flexDirection="column"
          gap="10px"
        >

          <Button
            size="sm"
            onClick={handleZoomIn}
            backgroundColor="rgba(255, 255, 255, 0.8)"
            border="none"
            borderRadius="4px"
            cursor="pointer"
            boxShadow="md"
          >
            Zoom In
          </Button>
          <Button
            size="sm"
            onClick={handleZoomOut}
            backgroundColor="rgba(255, 255, 255, 0.8)"
            border="none"
            borderRadius="4px"
            cursor="pointer"
            boxShadow="md"
          >
            Zoom Out
          </Button>
          <Button
            size="sm"
            onClick={handleReset}
            backgroundColor="rgba(255, 255, 255, 0.8)"
            border="none"
            borderRadius="4px"
            cursor="pointer"
            boxShadow="md"
          >
            Reset
          </Button>
        </Box>
      )}

      {/* Base map image */}
      <Box
        position="relative"
        width="100%"
        height="100%"
      >
        {loadingImage ? (
          <Flex
            align="center"
            justify="center"
            height="100%"
            direction="column"
          >
            <Spinner size="xl" />
            <Box mt={4} fontSize="lg" color="gray.500">
              Loading map...
            </Box>
          </Flex>
        ) : (

          <Image
            src={imageUrl}
            alt={floor.name}
            width="100%"
            height="100%"
            objectFit="contain"
            display="block"
          />
        )}


        {/* SVG Overlay with Conditional Zoom and Pan */}
        {!loadingImage && (
          <>
            {enablePanAndZoom ? (
              <ReactSVGPanZoom
                width={width}
                height={height}
                background="#fff"
                tool={viewerTool}
                onChangeTool={setViewerTool}
                value={viewerValue}
                onChangeValue={setViewerValue}
                ref={Viewer}
                detectAutoPan={false}
                detectPinchGesture={true}
              >
                <svg
                  viewBox="0 0 8192 6416" // Replace with your actual image dimensions
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                >
                  {floor.areas.map((area: MapArea, index: number) => {
                    const fillColor = area.color || colorPalette[index % colorPalette.length];
                    const pointsString = area.polygon
                      .map(([x, y]) => `${x},${y}`)
                      .join(' ');

                    return (
                      <g key={area.id}>
                        {/* Polygon */}
                        <polygon
                          points={pointsString}
                          fill={showOverlays ? (area.locked ? 'rgba(128, 128, 128, 0.3)' : fillColor) : 'transparent'}
                          stroke={area.locked ? 'gray' : 'black'}
                          strokeWidth={2}
                          className={`image-mapper-shape ${area.locked ? 'locked' : 'unlocked'}`}
                          style={{
                            cursor: area.locked ? 'not-allowed' : 'pointer',
                            pointerEvents: 'auto',
                            transition: 'fill 0.3s, stroke 0.3s'
                          }}
                          onClick={(e) => {
                            if (area.locked) {
                              alert('This area is locked. Unlock to access.');
                              return;
                            }
                            e.stopPropagation(); // Prevent triggering underlying elements
                            onAreaClick(area);
                          }}
                          aria-label={area.name}
                          role="button"
                        />

                        {/* Display Points and Coordinates */}
                        {showPoints && area.polygon.map(([x, y], pointIndex) => (
                          <g key={`${area.id}-point-${pointIndex}`}>
                            {/* Point Marker */}
                            <circle
                              cx={x}
                              cy={y}
                              r={10} // Radius of the circle
                              fill="yellow"
                              stroke="black"
                              strokeWidth={1}
                              pointerEvents="none" // Let the polygon handle events
                            />

                            {/* Coordinate Label */}
                            <text
                              x={x + 15} // Offset label to the right
                              y={y - 15} // Offset label above
                              fontSize="100" // Adjust font size as needed
                              fill="black"
                              pointerEvents="none"
                              style={{ userSelect: 'none', textShadow: '1px 1px 2px white' }}
                            >
                              {`${x},${y}`}
                            </text>
                          </g>
                        ))}
                      </g>
                    );
                  })}
                </svg>
              </ReactSVGPanZoom>
            ) : (
              // Non-Zoomable SVG for Desktop or when not in fullscreen
              <svg
                viewBox="0 0 8192 6416" // Replace with your actual image dimensions
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none', // Allows the image to remain responsive
                }}
              >
                {floor.areas.map((area: MapArea, index: number) => {
                  const fillColor = area.color || colorPalette[index % colorPalette.length];
                  const pointsString = area.polygon
                    .map(([x, y]) => `${x},${y}`)
                    .join(' ');

                  return (
                    <g key={area.id}>
                      {/* Polygon */}
                      <polygon
                        points={pointsString}
                        fill={showOverlays ? (area.locked ? 'rgba(128, 128, 128, 0.3)' : fillColor) : 'transparent'}
                        stroke={area.locked ? 'gray' : 'black'}
                        strokeWidth={2}
                        className={`image-mapper-shape ${area.locked ? 'locked' : 'unlocked'}`}
                        style={{
                          cursor: area.locked ? 'not-allowed' : 'pointer',
                          pointerEvents: 'auto',
                          transition: 'fill 0.3s, stroke 0.3s'
                        }}
                        onClick={(e) => {
                          if (area.locked) {
                            alert('This area is locked. Unlock to access.');
                            return;
                          }
                          e.stopPropagation(); // Prevent triggering underlying elements
                          onAreaClick(area);
                        }}
                        aria-label={area.name}
                        role="button"
                      />

                      {/* Display Points and Coordinates */}
                      {showPoints && area.polygon.map(([x, y], pointIndex) => (
                        <g key={`${area.id}-point-${pointIndex}`}>
                          {/* Point Marker */}
                          <circle
                            cx={x}
                            cy={y}
                            r={10} // Radius of the circle
                            fill="yellow"
                            stroke="black"
                            strokeWidth={1}
                            pointerEvents="none" // Let the polygon handle events
                          />

                          {/* Coordinate Label */}
                          <text
                            x={x + 15} // Offset label to the right
                            y={y - 15} // Offset label above
                            fontSize="100" // Adjust font size as needed
                            fill="black"
                            pointerEvents="none"
                            style={{ userSelect: 'none', textShadow: '1px 1px 2px white' }}
                          >
                            {`${x},${y}`}
                          </text>
                        </g>
                      ))}
                    </g>
                  );
                })}
              </svg>
            )}
          </>
        )}
      </Box>
    </Flex>
  );
};

export default InteractiveMap;
